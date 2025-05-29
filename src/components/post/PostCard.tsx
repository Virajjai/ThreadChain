
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, MessageSquare, Share, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Post } from '@/types';
import { cn } from '@/lib/utils';
import { TipButton } from './TipButton';
import { useApp } from '@/contexts/AppContext';

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onTip: (postId: string, amount: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onVote, onTip }) => {
  const navigate = useNavigate();
  const { setSelectedHashtag, setSearchQuery } = useApp();
  const [isLiked, setIsLiked] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(post.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(post.downvotes);
  const [userVote, setUserVote] = useState(post.userVote);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleVote = (voteType: 'up' | 'down') => {
    console.log(`Voting ${voteType} on post ${post.id}`);
    
    // Optimistic update
    if (userVote === voteType) {
      // Remove vote
      if (voteType === 'up') {
        setLocalUpvotes(prev => prev - 1);
      } else {
        setLocalDownvotes(prev => prev - 1);
      }
      setUserVote(null);
    } else {
      // Add new vote, remove old if exists
      if (userVote === 'up') {
        setLocalUpvotes(prev => prev - 1);
      } else if (userVote === 'down') {
        setLocalDownvotes(prev => prev - 1);
      }
      
      if (voteType === 'up') {
        setLocalUpvotes(prev => prev + 1);
      } else {
        setLocalDownvotes(prev => prev + 1);
      }
      setUserVote(voteType);
    }
    
    onVote(post.id, voteType);
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

  const handlePostClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('[role="button"]')) {
      return;
    }
    navigate(`/post/${post.id}`);
  };

  const handleHashtagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedHashtag(tag);
    setSearchQuery('');
    navigate('/');
  };

  const handleUserClick = (username: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/${username}`);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowImageModal(true);
  };

  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/post/${post.id}`);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 300
        }}
      >
        <Card 
          className="glass border-border/50 hover:border-primary/20 transition-all duration-300 cursor-pointer relative overflow-hidden group"
          onClick={handlePostClick}
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="p-6 relative z-10">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Avatar 
                  className="w-10 h-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                  onClick={(e) => handleUserClick(post.author.username, e)}
                >
                  <img 
                    src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} 
                    alt={post.author.displayName}
                    className="w-full h-full object-cover"
                  />
                </Avatar>
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    onClick={(e) => handleUserClick(post.author.username, e)}
                    className="font-semibold hover:text-primary transition-colors cursor-pointer"
                  >
                    {post.author.displayName}
                  </motion.span>
                  {post.author.isVerified && (
                    <motion.div 
                      whileHover={{ scale: 1.2 }}
                      className="w-4 h-4 bg-solana-green rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs text-white">✓</span>
                    </motion.div>
                  )}
                  <span className="text-muted-foreground">@{post.author.username}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-sm">
                    {formatTimeAgo(post.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <p className="text-foreground leading-relaxed mb-3">
                {post.content}
              </p>
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <motion.span 
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleHashtagClick(tag, e)}
                      className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md hover:bg-primary/20 cursor-pointer transition-all duration-200 border border-primary/20"
                    >
                      #{tag}
                    </motion.span>
                  ))}
                </div>
              )}

              {/* Media */}
              {post.mediaUrl && (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg overflow-hidden border border-border cursor-pointer relative group"
                  onClick={handleImageClick}
                >
                  {post.mediaType === 'image' ? (
                    <img 
                      src={post.mediaUrl} 
                      alt="Post media"
                      className="w-full h-auto max-h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <video 
                      src={post.mediaUrl}
                      controls
                      className="w-full h-auto max-h-96"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="bg-black/50 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="text-white text-sm">Click to expand</span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center space-x-4">
                {/* Voting */}
                <div className="flex items-center space-x-1">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote('up');
                      }}
                      className={cn(
                        'hover:bg-green-500/10 hover:text-green-500 transition-all duration-200',
                        userVote === 'up' && 'bg-green-500/10 text-green-500'
                      )}
                    >
                      <ChevronUp className="w-4 h-4" />
                      <span className="ml-1">{localUpvotes}</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVote('down');
                      }}
                      className={cn(
                        'hover:bg-red-500/10 hover:text-red-500 transition-all duration-200',
                        userVote === 'down' && 'bg-red-500/10 text-red-500'
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                      <span className="ml-1">{localDownvotes}</span>
                    </Button>
                  </motion.div>
                </div>

                {/* Comments */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-200"
                    onClick={handleCommentsClick}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="ml-1">{post.commentCount}</span>
                  </Button>
                </motion.div>

                {/* Like */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                    className={cn(
                      'hover:bg-pink-500/10 hover:text-pink-500 transition-all duration-200',
                      isLiked && 'bg-pink-500/10 text-pink-500'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                  </Button>
                </motion.div>

                {/* Share */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Share className="w-4 h-4" />
                  </Button>
                </motion.div>
              </div>

              {/* Tip Info & Button */}
              <div className="flex items-center space-x-3">
                {post.tipAmount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-sm text-solana-green font-medium"
                  >
                    {post.tipAmount} SOL tipped
                  </motion.div>
                )}
                <div onClick={(e) => e.stopPropagation()}>
                  <TipButton 
                    postId={post.id}
                    authorUsername={post.author.username}
                    onTip={onTip}
                    hasUserTipped={post.hasUserTipped}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-7xl w-full h-full max-h-[95vh] p-0 overflow-hidden bg-black/95 border-none">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
            {post.mediaUrl && (
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={post.mediaUrl} 
                alt="Post media"
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: '90vh' }}
              />
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  );
};
