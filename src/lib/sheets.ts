import { google } from "googleapis";
import { env } from "@/config/site";

export type Post = {
  slug: string;
  title: string;
  [key: string]: string;
};
// Cache for posts to avoid multiple API calls during build
// During build, cache persists for the entire build duration (effectively infinite)
// In runtime, use shorter TTL for fresh data
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || process.env.NODE_ENV === 'production';
let postsCache: Post[] | null = null;
let cacheTimestamp: number = 0;
// During build, cache never expires. In runtime, 5 minutes
const CACHE_TTL = isBuildTime ? Number.MAX_SAFE_INTEGER : 5 * 60 * 1000;

function getAuthClient() {
  return new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: env.GOOGLE_PROJECT_ID,
      client_id: env.GOOGLE_CLIENT_ID,
      client_email: env.GOOGLE_CLIENT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
}

// Rate limiting helper
// Google Sheets API allows 60 requests per minute per user
// During build, be extra conservative: 2 seconds between requests (30 req/min)
// In runtime, 1.2 seconds is fine (50 req/min)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = isBuildTime ? 2000 : 1200; // 2 seconds during build, 1.2 seconds in runtime
const requestQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void; fn: () => Promise<any> }> = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue) return;
  if (requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const { resolve, reject, fn } = requestQueue.shift()!;
    
    try {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }
      
      lastRequestTime = Date.now();
      
      // Retry logic with exponential backoff
      let result;
      const retries = 3;
      for (let attempt = 0; attempt < retries; attempt++) {
        try {
          result = await fn();
          break;
        } catch (error: unknown) {
          // Check if it's a rate limit error (429)
          const isRateLimitError = error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 429;
          if (isRateLimitError && attempt < retries - 1) {
            const backoffDelay = Math.min(2000 * Math.pow(2, attempt), 30000); // Max 30 seconds
            console.warn(`Rate limit hit, retrying in ${backoffDelay}ms... (attempt ${attempt + 1}/${retries})`);
            await new Promise(resolve => setTimeout(resolve, backoffDelay));
            continue;
          }
          throw error;
        }
      }
      
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }
  
  isProcessingQueue = false;
}

async function rateLimitedRequest<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    requestQueue.push({ resolve, reject, fn });
    // Process queue asynchronously, but ensure only one processor runs
    if (!isProcessingQueue) {
      // Use setImmediate or setTimeout to ensure queue processing happens asynchronously
      if (typeof setImmediate !== 'undefined') {
        setImmediate(() => processQueue());
      } else {
        setTimeout(() => processQueue(), 0);
      }
    }
  });
}

export async function getSheetRows(sheetName: string): Promise<string[][]> {
  try {
    return await rateLimitedRequest(async () => {
      const auth = getAuthClient();
      const sheets = google.sheets({ version: "v4", auth });

      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: env.SPREADSHEET_ID,
        range: sheetName,
      });

      return res.data.values ?? [];
    });
  } catch (error: unknown) {
    // Handle sheet not found or invalid range errors
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? String((error as { message: string }).message) 
      : String(error);
    
    if (errorMessage.includes('Unable to parse range') || errorMessage.includes('Unable to parse')) {
      console.warn(`Sheet "${sheetName}" not found or invalid range`);
      return [];
    }
    
    // During build, if we hit quota errors, return empty array to allow build to continue
    // The page will be generated with empty data, but build won't fail
    const isQuotaError = error && typeof error === 'object' && 'code' in error && (error as { code: number }).code === 429;
    if (isQuotaError && isBuildTime) {
      console.error(`Quota exceeded for sheet "${sheetName}". Returning empty data to allow build to continue.`);
      return [];
    }
    
    // Re-throw other errors
    throw error;
  }
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  const [headers, ...data] = rows;
  return data.map((row) =>
    headers.reduce((acc, header, i) => {
      acc[header.trim().toLowerCase()] = row[i]?.trim() ?? "";
      return acc;
    }, {} as Record<string, string>)
  );
}

export async function getPosts(): Promise<Post[]> {
  // Return cached data if available and not expired
  const now = Date.now();
  if (postsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return postsCache;
  }

  // Fetch fresh data
  const rows = await getSheetRows("Posts");
  if (!rows.length) {
    postsCache = [];
    cacheTimestamp = now;
    return [];
  }

  const objects = rowsToObjects(rows);

  postsCache = objects
    .filter((row) => row.slug)
    .map((row) => ({
      ...row,
      slug: row.slug,
      title: row.title ?? "",
    })) as Post[];
  
  cacheTimestamp = now;
  return postsCache;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}

/**
 * Get only post slugs (lightweight function for generateStaticParams)
 * This avoids fetching and caching large post data during build
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    const rows = await getSheetRows("Posts");
    if (!rows.length || rows.length < 2) {
      return [];
    }

    // Find slug column index
    const headers = rows[0];
    const slugIndex = headers.findIndex(
      (h) => h?.trim().toLowerCase() === 'slug'
    );

    if (slugIndex === -1) {
      return [];
    }

    // Extract only slugs from rows (skip header)
    return rows
      .slice(1)
      .map((row) => row[slugIndex]?.trim())
      .filter((slug): slug is string => Boolean(slug));
  } catch (error) {
    console.error('Error fetching post slugs:', error);
    return [];
  }
}

/**
 * Get posts filtered by category and keywords containing 'state' (only for 'business-compliance')
 * Excludes posts with slug 'federal-regulations' and sorts results alphabetically by title
 * @param category - The category name to filter by (e.g., 'business-compliance')
 */
export async function getStateCategoryPosts(category: string): Promise<Post[]> {
  const allPosts = await getPosts();
  
  const filtered = allPosts.filter((post) => {
    const categoryMatch = post.category?.toLowerCase() === category.toLowerCase();
    
    // Only check keywords for 'state' if category is 'business-compliance'
    let keywordsMatch = true;
    if (category.toLowerCase() === 'business-compliance') {
      keywordsMatch = post.keywords?.toLowerCase().includes('state') || false;
    }
    
    const notFederal = post.slug?.toLowerCase() !== 'federal-regulations';
    return categoryMatch && keywordsMatch && notFederal;
  });
  
  // Sort alphabetically by title
  return filtered.sort((a, b) => {
    const titleA = a.title?.toLowerCase() || '';
    const titleB = b.title?.toLowerCase() || '';
    return titleA.localeCompare(titleB);
  });
}

/**
 * Get posts filtered by category
 * @param category - The category name to filter by (e.g., 'business-funding')
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter(
    (post) => post.category?.toLowerCase() === category.toLowerCase()
  );
}

// export async function getPostsBySector(category: string, sector: string): Promise<Post[]> {
//   const posts = await getPosts();
//   return posts.filter(
//     (post) => post.category === category && post.filters?.split(",")[0]?.trim().toLowerCase() === sector.toLowerCase()
//   );
//   // return posts.filter(
//   //   (post) => post.category === category
//   // );
// }

// export async function getPostsBySectorSlug(sectorSlug: string): Promise<Post[]> {
//   const posts = await getPosts();
//   return posts.filter(
//     (post) => post.filters?.split(",")[0]?.trim().toLowerCase() === sectorSlug.toLowerCase()
//   );
// }

// export type City = {
//   city: string;
//   state: string;
//   [key: string]: string;
// };

// Cache for cities
// During build, cache persists for the entire build duration (effectively infinite)
// let citiesCache: City[] | null = null;
// let citiesCacheTimestamp: number = 0;
// const CITIES_CACHE_TTL = isBuildTime ? Number.MAX_SAFE_INTEGER : 5 * 60 * 1000;

// const possibleSheetNames = ["Cities", "City", "Locations", "cities", "city"];

/**
 * Get all cities from the spreadsheet
 * Tries multiple possible sheet names
 */
// export async function getCities(): Promise<City[]> {
//   const now = Date.now();
//   if (citiesCache && (now - citiesCacheTimestamp) < CITIES_CACHE_TTL) {
//     return citiesCache;
//   }

//   for (const sheetName of possibleSheetNames) {
//     try {
//       const rows = await getSheetRows(sheetName);
//       if (rows.length > 0) {
//         const objects = rowsToObjects(rows);
//         citiesCache = objects as City[];
//         citiesCacheTimestamp = now;
//         return citiesCache;
//       }
//     } catch (error: unknown) {
//       // Check if it's a Google API error indicating invalid range
//       if (
//         typeof error === 'object' &&
//         error !== null &&
//         'code' in error &&
//         (error as { code: number }).code === 400 &&
//         'message' in error &&
//         typeof (error as { message: string }).message === 'string' &&
//         (error as { message: string }).message.includes('Unable to parse range')
//       ) {
//         console.warn(`Sheet "${sheetName}" not found or invalid range, trying next...`);
//         continue; // Try next sheet name
//       }
//       // Re-throw other unexpected errors
//       throw error;
//     }
//   }

//   console.warn('Cities sheet not found. Tried:', possibleSheetNames.join(', '));
//   citiesCache = [];
//   citiesCacheTimestamp = now;
//   return [];
// }

/**
 * Get cities filtered by state code (uppercase)
 */
// export async function getCitiesByState(stateCode: string): Promise<City[]> {
//   const cities = await getCities();
//   const upperStateCode = stateCode.toUpperCase();

//   return cities.filter(
//     (city) => city.state?.toUpperCase() === upperStateCode
//   );
// }