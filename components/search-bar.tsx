"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      } else {
        console.error('Failed to fetch suggestions:', res.status);
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowSuggestions(true);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced search
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // Increased debounce time slightly
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    if (!search.trim()) {
      // If empty search, redirect to main page without query
      router.push('/main');
      return;
    }

    const params = new URLSearchParams();
    params.set("q", search.trim());
    router.push(`/main?${params.toString()}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion);
    setShowSuggestions(false);
    router.push(`/main?q=${encodeURIComponent(suggestion)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 mx-8 relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search by city, region, country, or postal code..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={handleChange}
          onFocus={() => search && setShowSuggestions(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      {/* No results message */}
      {showSuggestions && !isLoading && search.trim() && suggestions.length === 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 px-4 py-2 text-gray-500">
          No suggestions found
        </div>
      )}
    </form>
  );
}