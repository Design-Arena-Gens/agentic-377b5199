"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 shadow-sm">
      <MagnifyingGlassIcon className="h-5 w-5 text-secondary" />
      <input
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Search for products"
        className="ml-2 w-full border-none bg-transparent text-sm outline-none"
      />
      <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
        Search
      </button>
    </form>
  );
}
