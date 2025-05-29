
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Post, Comment, Notification } from '@/types';
import { mockPosts, searchPosts, getPostsByHashtag } from '@/data/posts';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  filteredPosts: Post[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedHashtag: string | null;
  setSelectedHashtag: (hashtag: string | null) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(mockPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter posts based on search query or selected hashtag
  useEffect(() => {
    let filtered = posts;
    
    if (searchQuery) {
      filtered = searchPosts(searchQuery);
    } else if (selectedHashtag) {
      filtered = getPostsByHashtag(selectedHashtag);
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedHashtag]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      posts,
      setPosts,
      filteredPosts,
      searchQuery,
      setSearchQuery,
      selectedHashtag,
      setSelectedHashtag,
      notifications,
      setNotifications,
      isLoading,
      setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
