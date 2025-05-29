
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { User, Camera, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime12&mouth=concerned&eyes=cry',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime13&mouth=default&eyes=default',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime14&mouth=smile&eyes=squint',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=anime15&mouth=eating&eyes=default'
];

const SetupProfile = () => {
  const navigate = useNavigate();
  const { publicKey, connected } = useWallet();
  const { setCurrentUser } = useApp();
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(animeAvatars[0]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    if (!displayName.trim() || !username.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in both display name and username",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create user profile
      const newUser = {
        id: 'current-user',
        walletAddress: publicKey.toString(),
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatar: selectedAvatar,
        followerCount: 0,
        followingCount: 0,
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      setCurrentUser(newUser);

      toast({
        title: "Profile created successfully! 🎉",
        description: "Welcome to ThreadChain!"
      });

      navigate('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Failed to create profile",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!connected) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="glass border-border/50">
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-white font-bold text-2xl">TC</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gradient">
              Welcome to ThreadChain!
            </CardTitle>
            <p className="text-muted-foreground">
              Let's set up your profile to get started
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      type="button"
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
                      {selectedAvatar === avatar && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-medium">
                  Display Name *
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={50}
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  placeholder="Enter your username"
                  maxLength={30}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Only letters, numbers, and underscores allowed
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Bio (Optional)
                </Label>
                <Input
                  id="bio"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground">
                  {bio.length}/160 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !displayName.trim() || !username.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Profile...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Create Profile</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SetupProfile;
