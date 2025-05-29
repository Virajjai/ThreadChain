
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share, Send } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { PostCard } from '@/components/post/PostCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { Comment } from '@/types';

const PostDetail = () => {
  const { postId } = useParams();
  const { posts, currentUser } = useApp();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      postId: postId || '',
      author: {
        id: 'user1',
        walletAddress: '0x123',
        username: 'cryptodev',
        displayName: 'Crypto Developer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment1',
        followerCount: 150,
        followingCount: 75,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      content: 'Great post! Really insightful perspective on the current market trends.',
      upvotes: 12,
      downvotes: 1,
      replies: [],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      postId: postId || '',
      author: {
        id: 'user2',
        walletAddress: '0x456',
        username: 'blockchainbae',
        displayName: 'Blockchain Bae',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=comment2',
        followerCount: 320,
        followingCount: 180,
        isVerified: false,
        createdAt: new Date().toISOString()
      },
      content: 'I totally agree with this analysis. The fundamentals are looking strong.',
      upvotes: 8,
      downvotes: 0,
      replies: [],
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
  ]);

  const post = posts.find(p => p.id === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Post not found</p>
        </div>
      </div>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      author: currentUser,
      content: newComment,
      upvotes: 0,
      downvotes: 0,
      replies: [],
      createdAt: new Date().toISOString()
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
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
            {/* Back Button */}
            <Link to="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Button>
            </Link>

            {/* Main Post */}
            <PostCard post={post} onVote={() => {}} onTip={() => {}} />

            {/* Comments Section */}
            <Card className="glass border-border/50">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
                
                {/* Add Comment */}
                {currentUser && (
                  <div className="flex space-x-3 mb-6">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex space-x-2">
                      <Input
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <Button onClick={handleAddComment} size="sm">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-border pb-4 last:border-b-0"
                    >
                      <div className="flex space-x-3">
                        <Link to={`/user/${comment.author.username}`}>
                          <Avatar className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                            <AvatarImage src={comment.author.avatar} />
                            <AvatarFallback>{comment.author.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Link 
                              to={`/user/${comment.author.username}`}
                              className="font-semibold hover:text-primary transition-colors"
                            >
                              {comment.author.displayName}
                            </Link>
                            {comment.author.isVerified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-xs text-white">✓</span>
                              </div>
                            )}
                            <span className="text-muted-foreground text-sm">
                              @{comment.author.username}
                            </span>
                            <span className="text-muted-foreground text-sm">•</span>
                            <span className="text-muted-foreground text-sm">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-foreground mb-2">{comment.content}</p>
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                              <Heart className="w-4 h-4 mr-1" />
                              {comment.upvotes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Reply
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
                              <Share className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PostDetail;
