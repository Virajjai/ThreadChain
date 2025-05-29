
import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Calendar, MapPin, Link as LinkIcon, Edit, TrendingUp, DollarSign, MessageCircle, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';

const Profile = () => {
  const { connected } = useWallet();
  const { currentUser, posts } = useApp();

  if (!connected || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Please connect your wallet to view your profile.</p>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.author.id === currentUser.id);
  const totalUpvotes = userPosts.reduce((sum, post) => sum + post.upvotes, 0);
  const totalTips = userPosts.reduce((sum, post) => sum + post.tipAmount, 0);
  const totalComments = userPosts.reduce((sum, post) => sum + post.commentCount, 0);

  const stats = [
    { label: 'Posts', value: userPosts.length, icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Total Upvotes', value: totalUpvotes, icon: Heart, color: 'text-red-500' },
    { label: 'SOL Earned', value: totalTips.toFixed(2), icon: DollarSign, color: 'text-green-500' },
    { label: 'Comments', value: totalComments, icon: MessageCircle, color: 'text-purple-500' },
  ];

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
            {/* Profile Header */}
            <Card className="glass border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.displayName} />
                    <AvatarFallback className="text-2xl">{currentUser.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{currentUser.displayName}</h1>
                      {currentUser.isVerified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">@{currentUser.username}</p>
                    <p className="text-sm mb-4">{currentUser.bio}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(currentUser.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <span><strong>{currentUser.followingCount}</strong> Following</span>
                      <span><strong>{currentUser.followerCount}</strong> Followers</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass">
                    <CardContent className="p-4 text-center">
                      <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Posts Section */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="liked">Liked</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
              
              <TabsContent value="posts" className="space-y-6 mt-6">
                {userPosts.length > 0 ? (
                  userPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PostCard 
                        post={post} 
                        onVote={() => {}}
                        onTip={() => {}}
                      />
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No posts yet. Create your first post!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="liked">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Liked posts will appear here.</p>
                </div>
              </TabsContent>
              
              <TabsContent value="media">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Media posts will appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
