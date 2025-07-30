import { Suspense } from 'react';
import { SearchBar } from './search-bar';

function SearchBarFallback() {
  return (
    <div className="flex-1 mx-8">
      <input
        type="text"
        placeholder="Search by city, region, country, or postal code..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled
      />
    </div>
  );
}

export function SearchBarWrapper() {
  return (
    <Suspense fallback={<SearchBarFallback />}>
      <SearchBar />
    </Suspense>
  );
}