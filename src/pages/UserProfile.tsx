
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, DollarSign, MessageCircle, Heart, UserPlus, UserMinus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { User } from '@/types';

// Mock user data - in real app this would come from API
const mockUsers: User[] = [
  {
    id: 'solana-dev',
    walletAddress: '0x789',
    username: 'solanadev',
    displayName: 'Solana Developer',
    bio: 'Building the future of decentralized social media on Solana. 🚀',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=solanadev',
    followerCount: 1250,
    followingCount: 180,
    isVerified: true,
    createdAt: new Date('2023-01-15').toISOString()
  },
  {
    id: 'crypto-analyst',
    walletAddress: '0x456',
    username: 'cryptoanalyst',
    displayName: 'Crypto Analyst',
    bio: 'Market analysis and insights. DeFi enthusiast. Not financial advice.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cryptoanalyst',
    followerCount: 890,
    followingCount: 320,
    isVerified: false,
    createdAt: new Date('2023-03-22').toISOString()
  }
];

const UserProfile = () => {
  const { username } = useParams();
  const { posts } = useApp();
  
  // Find user by username
  const user = mockUsers.find(u => u.username === username);
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  const userPosts = posts.filter(post => post.author.username === username);
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
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback className="text-2xl">{user.displayName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-2xl font-bold">{user.displayName}</h1>
                      {user.isVerified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-2">@{user.username}</p>
                    <p className="text-sm mb-4">{user.bio}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <span><strong>{user.followingCount}</strong> Following</span>
                      <span><strong>{user.followerCount}</strong> Followers</span>
                    </div>
                  </div>
                  
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
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
                    <p className="text-muted-foreground">No posts yet.</p>
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

export default UserProfile;
