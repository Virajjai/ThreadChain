
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { FeedTabs } from '@/components/feed/FeedTabs';
import { useApp } from '@/contexts/AppContext';
import { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { connected } = useWallet();
  const { posts, setPosts } = useApp();
  const [activeTab, setActiveTab] = useState('trending');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  useEffect(() => {
    // Filter posts based on active tab
    let filtered = [...posts];
    
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
    
    setFilteredPosts(filtered);
  }, [activeTab, posts]);

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} on post ${postId}`);
    
    setPosts(currentPosts => 
      currentPosts.map(post => {
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
      })
    );
  };

  const handleTip = (postId: string, amount: number) => {
    console.log(`Tipping ${amount} SOL to post ${postId}`);
    
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            tipAmount: post.tipAmount + amount,
            hasUserTipped: true
          };
        }
        return post;
      })
    );
  };

  if (!connected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md mx-auto p-8"
        >
          <motion.div
            animate={{ 
              background: [
                'linear-gradient(135deg, #9945FF 0%, #14F195 100%)',
                'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
                'linear-gradient(135deg, #9945FF 0%, #14F195 100%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 rounded-2xl mx-auto flex items-center justify-center mb-6"
          >
            <span className="text-white font-bold text-3xl">D3</span>
          </motion.div>
          
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-4">
              Welcome to D3
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Decentralized Discovery & Discussion
            </p>
            <p className="text-muted-foreground mb-8">
              Connect your Solana wallet to start exploring the decentralized social experience.
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <WalletMultiButton />
          </motion.div>

          <div className="pt-8 space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center space-x-4">
              <span>🔥 Trending posts</span>
              <span>💰 SOL tipping</span>
              <span>🗳️ On-chain voting</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 max-w-4xl mx-auto">
          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-6 space-y-6">
            {/* Create Post Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Link to="/create">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass rounded-lg p-6 border border-border/50 hover:border-primary/20 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solana-purple to-solana-green flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground">
                        What's on your mind? Share your thoughts with the Solana community...
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.map((post, index) => (
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
              ))}
            </div>

            {/* Load More */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Button 
                variant="outline" 
                size="lg"
                className="glass hover:bg-accent"
              >
                Load More Posts
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
