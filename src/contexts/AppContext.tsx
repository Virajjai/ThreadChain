
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Post, Comment, Notification } from '@/types';
import { mockPosts, searchPosts as mockSearchPosts, getPostsByHashtag } from '@/data/posts';
import { useDatabase } from '@/hooks/useDatabase';

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
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { usePosts, searchPosts } = useDatabase();
  const { data: dbPosts, isLoading: postsLoading } = usePosts();

  // Update posts when database posts are loaded
  useEffect(() => {
    if (dbPosts && dbPosts.length > 0) {
      setPosts(dbPosts);
    } else {
      // Fallback to mock posts if no database posts
      setPosts(mockPosts);
    }
  }, [dbPosts]);

  // Filter posts based on search query or selected hashtag
  useEffect(() => {
    let filtered = posts;
    
    if (searchQuery) {
      // Use database search if we have database posts, otherwise use mock search
      if (dbPosts && dbPosts.length > 0) {
        searchPosts(searchQuery).then(searchResults => {
          setFilteredPosts(searchResults);
        }).catch(() => {
          // Fallback to filtering current posts
          filtered = posts.filter(post => 
            post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredPosts(filtered);
        });
        return;
      } else {
        filtered = mockSearchPosts(searchQuery);
      }
    } else if (selectedHashtag) {
      filtered = getPostsByHashtag(selectedHashtag);
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchQuery, selectedHashtag, dbPosts, searchPosts]);

  // Update loading state
  useEffect(() => {
    setIsLoading(postsLoading);
  }, [postsLoading]);

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
