
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchResults } from './SearchResults';
import { useDatabase } from '@/hooks/useDatabase';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Search posts, users, hashtags...",
  onSearch 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchPosts, searchProfiles } = useDatabase();

  // Handle search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setPosts([]);
      setProfiles([]);
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const [postsResult, profilesResult] = await Promise.all([
        searchPosts(searchQuery),
        searchProfiles(searchQuery)
      ]);
      
      setPosts(postsResult);
      setProfiles(profilesResult);
    } catch (error) {
      console.error('Search error:', error);
      setPosts([]);
      setProfiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    if (value.trim()) {
      setIsLoading(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="pl-10 glass border-border/50 focus:border-primary/50 transition-all duration-300"
        />
      </form>

      {isOpen && (
        <SearchResults
          query={query}
          posts={posts}
          profiles={profiles}
          isLoading={isLoading}
          onClose={handleClose}
        />
      )}
    </div>
  );
};
