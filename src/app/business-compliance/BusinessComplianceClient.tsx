'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/sheets';
import { useAppContext } from '@/contexts/AppContext';

interface BusinessComplianceClientProps {
  posts: Post[];
}

// Type for ZIP data
type ZipDataItem = {
  zip_code: number;
  city: string;
  state: string;
  county: string;
};

// Lazy-loaded ZIP lookup map for O(1) access
let zipLookupMap: Map<number, { city: string; state: string }> | null = null;
let zipDataPromise: Promise<Map<number, { city: string; state: string }>> | null = null;

// Initialize ZIP lookup map (lazy loaded)
function getZipLookupMap(): Promise<Map<number, { city: string; state: string }>> {
  if (zipLookupMap) {
    return Promise.resolve(zipLookupMap);
  }
  
  if (zipDataPromise) {
    return zipDataPromise;
  }
  
  zipDataPromise = import('@/data/USCities.json').then((module) => {
    const zipData = module.default as ZipDataItem[];
    const map = new Map<number, { city: string; state: string }>();
    
    // Build lookup map for O(1) access
    zipData.forEach((item) => {
      map.set(item.zip_code, { city: item.city, state: item.state });
    });
    
    zipLookupMap = map;
    return map;
  });
  
  return zipDataPromise;
}

// Helper function to lookup city and state from ZIP code (optimized with Map)
async function lookupZipCode(zip: string): Promise<{ city: string; state: string; found: boolean }> {
  if (!zip || zip.length < 5) {
    return { city: '', state: '', found: false };
  }
  
  try {
    const zipNumber = parseInt(zip, 10);
    if (isNaN(zipNumber)) {
      return { city: '', state: '', found: false };
    }
    
    const map = await getZipLookupMap();
    const matched = map.get(zipNumber);
    
    if (matched) {
      return { city: matched.city, state: matched.state, found: true };
    }
  } catch (error) {
    console.error('Error looking up ZIP code:', error);
  }
  
  return { city: '', state: '', found: false };
}

export default function BusinessComplianceClient({ posts }: BusinessComplianceClientProps) {
  const { selectedZip, setSelectedZip } = useAppContext();
  const defaultZip = selectedZip || '10001';
  
  const [zipCode, setZipCode] = useState<string>(defaultZip);
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipFound, setZipFound] = useState<boolean>(false);
  const [isLoadingZip, setIsLoadingZip] = useState<boolean>(false);
  const filterRef = useRef<HTMLElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize ZIP lookup on mount
  useEffect(() => {
    const initializeZip = async () => {
      const zipToLookup = selectedZip || defaultZip;
      if (zipToLookup && zipToLookup.length >= 5) {
        setIsLoadingZip(true);
        try {
          const zipData = await lookupZipCode(zipToLookup);
          setZipCode(zipToLookup);
          setCity(zipData.city);
          setState(zipData.state);
          setZipFound(zipData.found);
        } catch (error) {
          console.error('Error initializing ZIP:', error);
        } finally {
          setIsLoadingZip(false);
        }
      }
    };
    
    initializeZip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount - selectedZip/defaultZip are initial values

  // Sync City and State when selectedZip changes from context (e.g., from HeroSection)
  const prevSelectedZipRef = useRef<string | undefined>(selectedZip);
  
  useEffect(() => {
    // Only update if selectedZip changed and is different from current zipCode
    if (selectedZip && selectedZip !== prevSelectedZipRef.current && selectedZip !== zipCode && selectedZip.length >= 5) {
      setIsLoadingZip(true);
      lookupZipCode(selectedZip).then((zipData) => {
        setZipCode(selectedZip);
        setCity(zipData.city);
        setState(zipData.state);
        setZipFound(zipData.found);
        setIsLoadingZip(false);
        prevSelectedZipRef.current = selectedZip;
      }).catch((error) => {
        console.error('Error looking up ZIP from context:', error);
        setIsLoadingZip(false);
      });
    }
  }, [selectedZip, zipCode]);

  // Filter posts by city and state (compare with posts.cities and posts.state fields)
  const filteredPosts = useMemo(() => {
    if (!city || !state) {
      return posts;
    }
    
    const cityLower = city.toLowerCase();
    const stateUpper = state.toUpperCase(); // State codes are uppercase (NY, MA, etc.)

    // Filter posts by city
    // Fix: correctly filter by city and state, and return a flat array (not an array of arrays)
    const filtered = posts.filter((post) => {
      const postData = post as Record<string, string>;
      const postCities = postData.cities?.trim().toLowerCase() || '';
      const postStates = postData.states?.trim().toUpperCase() || '';
      const postKeywords = postData.keywords?.trim().toLowerCase() || '';

      // Match city or (state and keywords === 'state')
      const matchesCity =
        postCities && postCities === cityLower;

      const matchesStateAndKeyword =
        postStates === stateUpper && postKeywords === 'state';

      return matchesCity || matchesStateAndKeyword;
    });

    return filtered;
  }, [city, state, posts]);

  // Debounced ZIP lookup function
  const performZipLookup = useCallback(async (zip: string) => {
    if (zip.length < 5) {
      setCity('');
      setState('');
      setZipFound(false);
      return;
    }
    
    setIsLoadingZip(true);
    try {
      const zipData = await lookupZipCode(zip);
      setCity(zipData.city);
      setState(zipData.state);
      setZipFound(zipData.found);
    } catch (error) {
      console.error('Error looking up ZIP code:', error);
      setCity('');
      setState('');
      setZipFound(false);
    } finally {
      setIsLoadingZip(false);
    }
  }, []);

  // Handle ZIP code change with debouncing
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, '').substring(0, 5);
    setZipCode(zip);
    setSelectedZip(zip); // Update context
    
    // Clear previous debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // If ZIP is complete (5 digits), lookup immediately
    // Otherwise, debounce for 500ms
    if (zip.length === 5) {
      performZipLookup(zip);
    } else if (zip.length >= 3) {
      debounceTimerRef.current = setTimeout(() => {
        performZipLookup(zip);
      }, 500);
    } else {
      setCity('');
      setState('');
      setZipFound(false);
    }
  };

  const handleClear = async () => {
    // Reset to default ZIP code
    const defaultZip = '10001';
    setZipCode(defaultZip);
    setSelectedZip(defaultZip); // Update context
    
    // Look up city and state for default ZIP
    await performZipLookup(defaultZip);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <main id="main-content" className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Business Compliance
              </h1>
              <div className="px-3 py-1 bg-white hover:bg-[#667eea] group hover:text-white rounded-md">
                <span className="text-2xl font-semibold text-[#667eea] group-hover:text-white">
                  {filteredPosts.length}
                </span>
              </div>
            </div>
          </div>
          <p className="text-base text-gray-600">
          Enter a ZIP Code to lookup local, state and federal legal requirements for your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filter Section - Right Sidebar */}
          <aside 
            ref={filterRef}
            className="md:col-span-1" 
          >
            <div className="p-1">
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
                        disabled={isLoadingZip}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="XXXXX"
                        maxLength={5}
                      />
                      {isLoadingZip && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
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
          <div className="md:col-span-3">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-stretch md:gap-4">
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
                  No compliance options found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
