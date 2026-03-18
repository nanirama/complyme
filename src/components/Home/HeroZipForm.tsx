'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';

export default function HeroZipForm() {
  const router = useRouter();
  const { selectedZip, setSelectedZip } = useAppContext();
  const [zipCode, setZipCode] = useState(selectedZip || '');

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSelectedZip(zipCode);
      router.push('/business-compliance');
    },
    [router, setSelectedZip, zipCode]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-stretch mt-4 max-w-lg"
      role="search"
      aria-label="Get started by entering your zip code"
    >
      <label htmlFor="zip-input" className="sr-only">
        Enter your zip code
      </label>
      <input
        id="zip-input"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={10}
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        placeholder="ZipCode"
        className="flex-1 px-4 py-4 text-[17px] text-[#221638] placeholder-gray-400 bg-[#eaeaea] border-r-0 rounded-l-[5px] outline-none focus:ring-2 focus:ring-transparent focus:ring-0"
        aria-required="true"
      />
      <button
        type="submit"
        className="flex items-center gap-2 bg-[#ff5d22] hover:bg-[#221638] active:bg-[#ff5d22] transition-colors px-5 py-3 rounded-r-sm text-white font-semibold text-[14px] whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8453C]"
      >
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 flex-shrink-0"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
        Get Started
      </button>
    </form>
  );
}

