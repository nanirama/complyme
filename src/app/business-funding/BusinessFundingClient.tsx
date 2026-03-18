'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/sheets';

// Type for ZIP data
type ZipDataItem = {
  zip_code: number;
  city: string;
  state: string;
  county: string;
};

// Lazy-loaded ZIP lookup map for O(1) access (avoids bundling large JSON into initial JS)
let zipLookupMap: Map<number, { city: string; state: string }> | null = null;
let zipDataPromise: Promise<Map<number, { city: string; state: string }>> | null = null;

function getZipLookupMap(): Promise<Map<number, { city: string; state: string }>> {
  if (zipLookupMap) return Promise.resolve(zipLookupMap);
  if (zipDataPromise) return zipDataPromise;

  zipDataPromise = import('@/data/USCities.json').then((module) => {
    const zipData = module.default as ZipDataItem[];
    const map = new Map<number, { city: string; state: string }>();
    zipData.forEach((item) => map.set(item.zip_code, { city: item.city, state: item.state }));
    zipLookupMap = map;
    return map;
  });

  return zipDataPromise;
}

async function lookupZipCode(zip: string): Promise<{ city: string; state: string; found: boolean }> {
  if (!zip || zip.length < 3) return { city: '', state: '', found: false };
  const zipNumber = parseInt(zip, 10);
  if (Number.isNaN(zipNumber)) return { city: '', state: '', found: false };

  try {
    const map = await getZipLookupMap();
    const matched = map.get(zipNumber);
    if (matched) return { city: matched.city, state: matched.state, found: true };
  } catch (error) {
    console.error('Error looking up ZIP code:', error);
  }

  return { city: '', state: '', found: false };
}

interface BusinessFundingClientProps {
  posts: Post[];
}

export default function BusinessFundingClient({ posts }: BusinessFundingClientProps) {
  const [zipCode, setZipCode] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipLoading, setZipLoading] = useState(false);
  const [zipFound, setZipFound] = useState(false);
  const filterRef = useRef<HTMLElement>(null);

  // Handle ZIP code change and auto-populate City, State
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, '').substring(0, 5);
    setZipCode(zip);
    
    // Clear city, state when ZIP changes
    if (zip.length < 3) {
      setCity('');
      setState('');
      setZipFound(false);
      return;
    }
    
    // Look up ZIP code when we have 3-5 digits
    if (zip.length >= 3 && zip.length <= 5) {
      setZipLoading(true);
      
      lookupZipCode(zip)
        .then((zipData) => {
          setCity(zipData.city);
          setState(zipData.state);
          setZipFound(zipData.found);
        })
        .catch((error) => {
          console.error('Error looking up ZIP code:', error);
          setCity('');
          setState('');
          setZipFound(false);
        })
        .finally(() => {
          setZipLoading(false);
        });
    }
  };

  // Get city from ZIP code lookup
  const cityFromZip = useMemo(() => {
    if (!zipCode || zipCode.length < 3) return '';
    // City/state are already derived from lookupZipCode in handleZipChange.
    return city || '';
  }, [city, zipCode]);

  // Filter posts based on location filters
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const postData = post as Record<string, string>;
      
      // If ZIP code is entered, use the city from ZIP lookup to filter by posts.cities field
      if (zipCode && zipCode.length >= 3) {
        const cityToMatch = cityFromZip || city; // Use city from ZIP lookup, fallback to manual city input
        
        if (cityToMatch) {
          const postCities = postData.cities?.trim();
          if (!postCities) return false;
          
          // Check if the city matches (cities field might be comma-separated or single value)
          const citiesList = postCities.split(',').map(c => c.trim().toLowerCase());
          const cityLower = cityToMatch.toLowerCase();
          
          if (!citiesList.includes(cityLower)) {
            return false;
          }
        }
      } else if (city) {
        // Manual city input (when ZIP not entered or not found)
        const postCities = postData.cities?.trim();
        if (!postCities) return false;
        
        const citiesList = postCities.split(',').map(c => c.trim().toLowerCase());
        const cityLower = city.toLowerCase();
        
        if (!citiesList.includes(cityLower)) {
          return false;
        }
      }
      
      // State filter (if set)
      if (state) {
        const postState = postData.state?.trim();
        if (postState?.toUpperCase() !== state.toUpperCase()) {
          return false;
        }
      }
      
      return true;
    });
  }, [posts, zipCode, city, state, cityFromZip]);

  const handleClear = () => {
    setZipCode('');
    setCity('');
    setState('');
    setZipFound(false);
  };

  return (
    <main id="main-content" className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Business Funding
              </h1>
              <div className="px-3 py-1 bg-white hover:bg-[#667eea] group hover:text-white rounded-md">
                <span className="text-2xl font-semibold text-[#667eea] group-hover:text-white">
                  {filteredPosts.length}
                </span>
              </div>
            </div>
          </div>
          <p className="text-base text-gray-600">
            Find small business programs and financing options
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Section - Right Sidebar */}
          <aside 
            ref={filterRef}
            className="flex-shrink-0 lg:ml-auto justify-end hidden"
          >
            <div className="p-6">
              {/* Locations Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Locations
                </h2>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="zip-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Zip
                    </label>
                    <div className="relative">
                      <input
                        id="zip-input"
                        type="text"
                        value={zipCode}
                        onChange={handleZipChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="XXXXX"
                        maxLength={5}
                      />
                      {zipLoading && (
                        <div className="absolute right-3 top-2.5">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="city-input" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      id="city-input"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        zipFound ? 'bg-gray-50' : 'bg-white'
                      }`}
                      readOnly={zipFound}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="state-input" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      id="state-input"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        zipFound ? 'bg-gray-50' : 'bg-white'
                      }`}
                      readOnly={zipFound}
                      placeholder="State"
                      maxLength={2}
                    />
                  </div>
                </div>
              </div>

              {/* Clear Button */}
              <button
                onClick={handleClear}
                className="
                  w-full
                  text-sm text-gray-600 hover:text-gray-900
                  underline
                  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded
                "
              >
                Clear
              </button>
            </div>
          </aside>

          {/* Content Grid - Right Side */}
          <div className="flex-1">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 items-stretch md:gap-4">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/${post.slug}`}
                    className="
                      group
                      flex items-center h-full
                      bg-white rounded-lg
                      p-1
                      shadow-sm hover:shadow-md
                      transition-all duration-200
                      focus-visible:outline-none
                      focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2
                    "
                  >
                    <div className="flex items-center gap-2 w-full px-2 py-3 h-full">
                      {/* Shop Icon */}
                      <div className="flex-shrink-0" aria-hidden="true">
                        <Image
                          src="/images/shop-iconV2.svg"
                          alt=""
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 min-w-0 flex flex-col">
                        <h3 className="
                          text-sm
                          font-semibold text-gray-900
                          leading-[120%]
                          break-words
                        ">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No funding options found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
