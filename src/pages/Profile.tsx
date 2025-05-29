
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { Calendar, MapPin, Link as LinkIcon, Edit, TrendingUp, DollarSign, MessageCircle, Heart, Camera, Save, X } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const animeAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime1&mouth=smile&eyes=happy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime2&mouth=smile&eyes=wink',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime3&mouth=eating&eyes=surprised',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime4&mouth=tongue&eyes=hearts',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime5&mouth=smile&eyes=cry',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime6&mouth=concerned&eyes=squint',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime7&mouth=serious&eyes=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime8&mouth=smile&eyes=happy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime9&mouth=eating&eyes=wink',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime10&mouth=tongue&eyes=surprised',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime11&mouth=smile&eyes=hearts',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime12&mouth=concerned&eyes=cry'
];

const Profile = () => {
  const { connected } = useWallet();
  const { currentUser, posts, setCurrentUser } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: currentUser?.displayName || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || ''
  });
  const [selectedAvatar, setSelectedAvatar] = useState(currentUser?.avatar || '');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setSelectedAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    const updatedUser = {
      ...currentUser,
      displayName: editForm.displayName,
      bio: editForm.bio,
      avatar: selectedAvatar
    };
    
    setCurrentUser(updatedUser);
    setIsEditModalOpen(false);
    toast({
      title: "Profile updated successfully!",
      description: "Your changes have been saved."
    });
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
                  
                  <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Edit className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Avatar Selection */}
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">Choose your avatar</Label>
                          
                          {/* Upload Custom Image */}
                          <div className="space-y-2">
                            <Label htmlFor="avatar-upload" className="text-xs text-muted-foreground">
                              Upload custom image
                            </Label>
                            <div className="flex items-center space-x-2">
                              <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('avatar-upload')?.click()}
                              >
                                <Camera className="w-4 h-4 mr-2" />
                                Upload Image
                              </Button>
                              {uploadedImage && (
                                <Avatar className="w-10 h-10">
                                  <AvatarImage src={uploadedImage} />
                                </Avatar>
                              )}
                            </div>
                          </div>
                          
                          {/* Anime Avatars */}
                          <div className="grid grid-cols-8 gap-3">
                            {animeAvatars.map((avatar, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className={`relative cursor-pointer rounded-full overflow-hidden border-2 transition-all ${
                                  selectedAvatar === avatar
                                    ? 'border-primary ring-2 ring-primary/50'
                                    : 'border-border hover:border-primary/50'
                                }`}
                                onClick={() => setSelectedAvatar(avatar)}
                              >
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={avatar} />
                                  <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={editForm.displayName}
                              onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                              id="bio"
                              value={editForm.bio}
                              onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                              placeholder="Tell us about yourself..."
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <Button onClick={handleSaveProfile} className="flex-1">
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
