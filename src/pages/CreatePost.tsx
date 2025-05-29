
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowLeft, Image, Tag, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navbar } from '@/components/layout/Navbar';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const CreatePost = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const { posts, setPosts } = useApp();
  
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a post",
        variant: "destructive"
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please add some content to your post",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate post creation (in real app, this would interact with Solana program)
      const newPost = {
        id: Date.now().toString(),
        author: {
          id: 'current-user',
          walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
          username: 'you',
          displayName: 'You',
          bio: 'New to D3!',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=you',
          followerCount: 0,
          followingCount: 0,
          isVerified: false,
          createdAt: new Date().toISOString()
        },
        content: content.trim(),
        mediaUrl: mediaPreview || undefined,
        mediaType: mediaFile?.type.startsWith('video/') ? 'video' as const : 'image' as const,
        tags: tags.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean),
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        tipAmount: 0,
        createdAt: new Date().toISOString(),
        userVote: null,
        hasUserTipped: false
      };

      // Add to posts
      setPosts([newPost, ...posts]);

      toast({
        title: "Post created successfully! 🎉",
        description: "Your post has been published to the Solana network",
      });

      // Navigate back to feed
      navigate('/');

    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Failed to create post",
        description: "There was an error publishing your post. Please try again.",
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-2xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gradient">Create Post</h1>
          </div>

          {/* Create Post Form */}
          <Card className="glass border-border/50">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  What's on your mind?
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts with the Solana community..."
                  className="min-h-32 resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Share your thoughts, insights, or discoveries</span>
                  <span>{content.length}/500</span>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Media (optional)</Label>
                
                {mediaPreview ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-lg overflow-hidden border border-border"
                  >
                    {mediaFile?.type.startsWith('video/') ? (
                      <video 
                        src={mediaPreview} 
                        controls 
                        className="w-full h-auto max-h-64 object-cover"
                      />
                    ) : (
                      <img 
                        src={mediaPreview} 
                        alt="Preview" 
                        className="w-full h-auto max-h-64 object-cover"
                      />
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setMediaFile(null);
                        setMediaPreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  </motion.div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Image className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Upload an image or video to enhance your post
                    </p>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleMediaUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <Label htmlFor="media-upload">
                      <Button type="button" variant="outline" asChild>
                        <span className="cursor-pointer">Choose File</span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  Tags (optional)
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="solana, web3, defi (comma separated)"
                />
                <p className="text-sm text-muted-foreground">
                  Add tags to help others discover your post
                </p>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting || !content.trim()}
                  className="w-full solana-gradient text-white border-0 hover:opacity-80"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing to Solana...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="w-4 h-4" />
                      <span>Publish Post</span>
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </Card>

          {/* Tips */}
          <Card className="glass border-border/50 p-6">
            <h3 className="text-lg font-semibold mb-4">📝 Posting Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Engage with the community by using relevant tags</li>
              <li>• Share original content and insights</li>
              <li>• Add media to make your posts more engaging</li>
              <li>• Interact with other posts to build your reputation</li>
              <li>• Your posts are stored on-chain permanently</li>
            </ul>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;
