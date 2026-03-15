'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/sheets';
import zipData from '@/data/USCities.json';
import { useAppContext } from '@/contexts/AppContext';

interface BusinessComplianceClientProps {
  posts: Post[];
}

export default function BusinessComplianceClient({ posts }: BusinessComplianceClientProps) {
  const { selectedZip, setSelectedZip } = useAppContext();
  const [zipCode, setZipCode] = useState<string>(selectedZip || '10001');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipFound, setZipFound] = useState(false);
  const [filterWidth, setFilterWidth] = useState<string>('100%');
  const [contentWidth, setContentWidth] = useState<string>('100%');
  const filterRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth >= 1024) {
        setFilterWidth('20%');
        setContentWidth('75%');
      } else {
        setFilterWidth('100%');
        setContentWidth('100%');
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Initialize City and State from default ZIP code on page load
  useEffect(() => {
    const initializeZipCode = () => {
      const defaultZip = selectedZip || '10001';
      if (!defaultZip || defaultZip.length < 3) return;
      
      try {
        const zipNumber = parseInt(defaultZip, 10);
        const matchedZip = (zipData as Array<{
          zip_code: number;
          city: string;
          state: string;
          county: string;
        }>).find((item) => item.zip_code === zipNumber);
        
        if (matchedZip) {
          setCity(matchedZip.city);
          setState(matchedZip.state);
          setZipFound(true);
        } else {
          setCity('');
          setState('');
          setZipFound(false);
        }
      } catch (error) {
        console.error('Error looking up default ZIP code:', error);
        setCity('');
        setState('');
        setZipFound(false);
      }
    };

    initializeZipCode();
  }, [selectedZip]);

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

  // Handle ZIP code change and auto-populate City, State
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const zip = e.target.value.replace(/\D/g, '').substring(0, 5);
    setZipCode(zip);
    setSelectedZip(zip); // Update context
    
    // Clear city, state when ZIP changes
    if (zip.length < 3) {
      setCity('');
      setState('');
      setZipFound(false);
      return;
    }
    
    // Look up ZIP code when we have 3-5 digits
    if (zip.length >= 3 && zip.length <= 5) {
      try {
        const zipNumber = parseInt(zip, 10);
        const matchedZip = (zipData as Array<{
          zip_code: number;
          city: string;
          state: string;
          county: string;
        }>).find((item) => item.zip_code === zipNumber);
        
        if (matchedZip) {
          setCity(matchedZip.city);
          setState(matchedZip.state);
          setZipFound(true);
        } else {
          setCity('');
          setState('');
          setZipFound(false);
        }
      } catch (error) {
        console.error('Error looking up ZIP code:', error);
        setCity('');
        setState('');
        setZipFound(false);
      }
    }
  };

  // Show all posts (no filtering)
  

  const handleClear = () => {
    setZipCode('10001');
    // setCity('');
    // setState('');
    // setZipFound(false);
    // setSelectedZip(''); // Clear context
  };

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

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Section - Right Sidebar */}
          <aside 
            ref={filterRef}
            className="flex-shrink-0 lg:ml-auto justify-end" 
            style={{ width: filterWidth }}
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
          <div className="flex-1" style={{ width: contentWidth }}>
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
