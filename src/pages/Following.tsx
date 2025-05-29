
import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Following = () => {
  const { posts, setPosts } = useApp();

  // Mock following users
  const followingUsers = [
    {
      id: '2',
      username: 'defi_degen',
      displayName: 'DeFi Degen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      bio: 'Yield farming across the Solana ecosystem',
      isVerified: true
    },
    {
      id: '3',
      username: 'nft_collector',
      displayName: 'NFT Collector',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      bio: 'Collecting digital art on Solana',
      isVerified: false
    }
  ];

  // Filter posts from followed users
  const followingPosts = posts.filter(post => 
    followingUsers.some(user => user.id === post.author.id)
  );

  const handleVote = (postId: string, voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} on post ${postId}`);
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const currentVote = post.userVote;
        let newUpvotes = post.upvotes;
        let newDownvotes = post.downvotes;
        let newUserVote: 'up' | 'down' | null = voteType;

        if (currentVote === 'up') {
          newUpvotes--;
        } else if (currentVote === 'down') {
          newDownvotes--;
        }

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 max-w-4xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold text-gradient flex items-center space-x-2">
              <Users className="w-8 h-8" />
              <span>Following</span>
            </h1>

            {/* Following Users */}
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">People you follow</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {followingUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-card/50 hover:bg-card transition-colors"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>{user.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <h3 className="font-medium">{user.displayName}</h3>
                          {user.isVerified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                        <p className="text-xs text-muted-foreground mt-1">{user.bio}</p>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Following
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Posts from Following */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Latest from your network</h2>
              
              {followingPosts.length > 0 ? (
                followingPosts.map((post, index) => (
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
                  <UserPlus className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No posts from people you follow yet.</p>
                  <p className="text-sm text-muted-foreground">Follow some users to see their posts here!</p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Following;
