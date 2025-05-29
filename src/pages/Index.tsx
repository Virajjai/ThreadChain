
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { TrendingTags } from '@/components/feed/TrendingTags';
import { useApp } from '@/contexts/AppContext';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Sparkles, Hash, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const { connected } = useWallet();
  const { 
    posts, 
    setPosts, 
    currentUser, 
    filteredPosts, 
    searchQuery, 
    setSearchQuery,
    selectedHashtag,
    setSelectedHashtag 
  } = useApp();
  const [activeTab, setActiveTab] = useState('trending');
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Filter posts based on active tab
    let filtered = [...filteredPosts];
    
    switch (activeTab) {
      case 'trending':
        filtered.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'hot':
        filtered.sort((a, b) => b.tipAmount - a.tipAmount);
        break;
      case 'new':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'following':
        // For demo, show all posts
        break;
      default:
        break;
    }
    
    setDisplayedPosts(filtered);
  }, [activeTab, filteredPosts]);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} on post ${postId}`);
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        // Remove previous vote if it exists
        if (currentVote === 'up') {
          newUpvotes--;
        } else if (currentVote === 'down') {
          newDownvotes--;
        }

        // Add new vote or remove if same
        if (currentVote === voteType) {
          newUserVote = null;
        } else {
          if (voteType === 'up') {
            newUpvotes++;
          } else {
            newDownvotes++;
          }
        }

        return {
          ...post,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  const handleTip = (postId: string, amount: number) => {
    console.log(`Tipping ${amount} SOL to post ${postId}`);
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          tipAmount: post.tipAmount + amount,
          hasUserTipped: true
        };
      }
      return post;
    });
    
    setPosts(updatedPosts);
  };

  const handleTagClick = (tag: string) => {
    setSelectedHashtag(tag);
    setSearchQuery('');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedHashtag(null);
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 3D Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${10 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center space-y-8 max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ 
              background: [
                'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
                'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)'
              ],
              boxShadow: [
                '0 0 20px rgba(59, 130, 246, 0.3)',
                '0 0 40px rgba(139, 92, 246, 0.4)',
                '0 0 20px rgba(59, 130, 246, 0.3)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-2xl mx-auto flex items-center justify-center mb-6"
          >
            <span className="text-white font-bold text-3xl">TC</span>
          </motion.div>
          
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gradient mb-4"
            >
              Welcome to ThreadChain
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground mb-8"
            >
              Decentralized Social Networking
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mb-8"
            >
              Connect your Solana wallet to start building your decentralized social presence.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WalletMultiButton />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="pt-8 space-y-4 text-sm text-muted-foreground"
          >
            <div className="flex items-center justify-center space-x-4">
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1"
              >
                <span>🔗</span>
                <span>Blockchain posts</span>
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1"
              >
                <span>💰</span>
                <span>SOL rewards</span>
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-1"
              >
                <span>🗳️</span>
                <span>Decentralized voting</span>
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Redirect to profile setup if no user profile
  if (connected && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">TC</span>
          </div>
          <h2 className="text-2xl font-bold">Almost there!</h2>
          <p className="text-muted-foreground">Let's set up your profile to complete your ThreadChain experience.</p>
          <Link to="/setup-profile">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
              Setup Profile
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background 3D Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05),transparent_50%)]" />
      </div>

      <Navbar />
      
      <div className="flex relative z-10">
        <Sidebar />
        
        <main className="flex-1 max-w-4xl mx-auto relative">
          {/* Search/Filter Header */}
          <AnimatePresence>
            {(searchQuery || selectedHashtag) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border-b border-border/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <span>Search: "{searchQuery}"</span>
                      </Badge>
                    )}
                    {selectedHashtag && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <Hash className="w-3 h-3" />
                        <span>{selectedHashtag}</span>
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear</span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="flex gap-6 p-6">
            {/* Main Feed */}
            <div className="flex-1 space-y-6">
              {/* Create Post Prompt */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link to="/create">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="glass rounded-lg p-6 border border-border/50 hover:border-primary/20 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    <div className="flex items-center space-x-4 relative z-10">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 180 }}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      >
                        <Plus className="w-5 h-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="text-muted-foreground">
                          What's happening on ThreadChain? Share your thoughts...
                        </p>
                      </div>
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1] 
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      >
                        <Sparkles className="w-5 h-5 text-primary" />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              {/* Posts Feed */}
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {displayedPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ 
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      whileHover={{
                        y: -4,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                      }}
                    >
                      <PostCard 
                        post={post} 
                        onVote={handleVote}
                        onTip={handleTip}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* No Results */}
              {displayedPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground mb-4">No posts found</p>
                  <Button onClick={clearFilters} variant="outline">
                    Show all posts
                  </Button>
                </motion.div>
              )}

              {/* Load More */}
              {displayedPosts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="glass hover:bg-accent relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">Load More Posts</span>
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Trending Sidebar */}
            <div className="hidden lg:block w-80">
              <div className="sticky top-24">
                <TrendingTags onTagClick={handleTagClick} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
