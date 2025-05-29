
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, User, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTheme } from '@/contexts/ThemeContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, notifications, posts } = useApp();
  const { connected } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const isActive = (path: string) => location.pathname === path;

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = posts.filter(post => 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.author.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery, posts]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchItemClick = (postId: string) => {
    navigate(`/post/${postId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">TC</span>
            </motion.div>
            <span className="text-xl font-bold text-gradient">ThreadChain</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input
                type="text"
                placeholder="Search posts, users, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              
              {/* Search Results */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-1 shadow-lg max-h-96 overflow-y-auto z-50"
                  >
                    {searchResults.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handleSearchItemClick(post.id)}
                        className="p-3 hover:bg-accent cursor-pointer border-b border-border last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>{post.author.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{post.author.displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {post.content.substring(0, 60)}...
                            </p>
                            {post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <span key={tag} className="text-xs bg-primary/10 text-primary px-1 rounded">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="relative"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <Link to="/create">
              <Button
                variant={isActive('/create') ? 'default' : 'ghost'}
                size="sm"
                className="relative"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:block ml-2">Create</span>
              </Button>
            </Link>

            <Link to="/notifications">
              <Button
                variant={isActive('/notifications') ? 'default' : 'ghost'}
                size="sm"
                className="relative"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* User Avatar or Wallet Connection */}
            {connected && currentUser ? (
              <Link to="/profile">
                <Avatar className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                  <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : connected && !currentUser ? (
              <Link to="/setup-profile">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Setup Profile
                </Button>
              </Link>
            ) : (
              <WalletMultiButton />
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
