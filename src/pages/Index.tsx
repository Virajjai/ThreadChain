
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { PostCard } from '@/components/post/PostCard';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { TrendingTags } from '@/components/feed/TrendingTags';
import { useApp } from '@/contexts/AppContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';

const Index = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();
  const { currentUser, filteredPosts, isLoading, searchQuery, setSelectedHashtag, setSearchQuery } = useApp();
  const [activeTab, setActiveTab] = useState('trending');

  // Mock vote handler - replace with actual implementation later
  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} on post ${postId}`);
    // TODO: Implement actual voting logic with database
  };

  // Mock tip handler - replace with actual implementation later
  const handleTip = (postId: string, amount: number) => {
    console.log(`Tipping ${amount} SOL on post ${postId}`);
    // TODO: Implement actual tipping logic with Solana
  };

  // Handle hashtag click
  const handleTagClick = (tag: string) => {
    setSelectedHashtag(tag);
    setSearchQuery('');
    navigate('/');
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // TODO: Implement filtering logic based on tab
  };

  // If wallet is not connected, show landing page
  if (!connected) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-8"
            >
              <span className="text-white font-bold text-3xl">TC</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Welcome to ThreadChain
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              The decentralized social platform where your voice matters. Connect your wallet to join the conversation, share your thoughts, and tip creators directly.
            </p>
            
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <WalletMultiButton />
              <p className="text-sm text-muted-foreground">
                Connect your Solana wallet to get started
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If wallet is connected but no user profile, redirect to setup
  if (connected && !currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Setup Your Profile</h2>
            <p className="text-muted-foreground mb-6">
              Complete your profile setup to start using ThreadChain
            </p>
            <Button 
              onClick={() => navigate('/setup-profile')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Setup Profile
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <SidebarInset className="flex-1">
          <Navbar />
          
          {/* Sidebar Trigger for mobile */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50 md:hidden">
            <SidebarTrigger />
            <span className="text-sm text-muted-foreground">Menu</span>
          </div>
          
          <div className="flex-1">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Feed */}
                <div className="lg:col-span-3">
                  <div className="space-y-6">
                    {searchQuery && (
                      <div className="text-center py-4">
                        <h2 className="text-xl font-semibold mb-2">
                          Search Results for "{searchQuery}"
                        </h2>
                        <p className="text-muted-foreground">
                          {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'} found
                        </p>
                      </div>
                    )}
                    
                    {!searchQuery && (
                      <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />
                    )}
                    
                    {/* Posts Feed */}
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="glass rounded-xl p-6">
                              <div className="animate-pulse">
                                <div className="flex items-center space-x-3 mb-4">
                                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                                  <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-muted rounded w-1/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/6"></div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="h-4 bg-muted rounded"></div>
                                  <div className="h-4 bg-muted rounded w-3/4"></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : filteredPosts.length > 0 ? (
                        filteredPosts.map((post, index) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <PostCard 
                              post={post} 
                              onVote={handleVote}
                              onTip={handleTip}
                            />
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground text-lg">
                            {searchQuery ? 'No posts found matching your search.' : 'No posts to display.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Trending Tags for larger screens */}
                <div className="hidden lg:block">
                  <div className="sticky top-24">
                    <TrendingTags onTagClick={handleTagClick} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
