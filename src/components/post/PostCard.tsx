
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, MessageSquare, Share, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Post } from '@/types';
import { cn } from '@/lib/utils';
import { TipButton } from './TipButton';

interface PostCardProps {
  post: Post;
  onVote: (postId: string, voteType: 'up' | 'down') => void;
  onTip: (postId: string, amount: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onVote, onTip }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(post.upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(post.downvotes);
  const [userVote, setUserVote] = useState(post.userVote);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass border-border/50 hover:border-primary/20 transition-all duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="w-10 h-10">
              <img 
                src={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`} 
                alt={post.author.displayName}
                className="w-full h-full object-cover"
              />
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Link 
                  to={`/user/${post.author.username}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {post.author.displayName}
                </Link>
                {post.author.isVerified && (
                  <div className="w-4 h-4 bg-solana-green rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">✓</span>
                  </div>
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
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md hover:bg-primary/20 cursor-pointer transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Media */}
            {post.mediaUrl && (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="rounded-lg overflow-hidden border border-border"
              >
                {post.mediaType === 'image' ? (
                  <img 
                    src={post.mediaUrl} 
                    alt="Post media"
                    className="w-full h-auto max-h-96 object-cover"
                  />
                ) : (
                  <video 
                    src={post.mediaUrl}
                    controls
                    className="w-full h-auto max-h-96"
                  />
                )}
              </motion.div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center space-x-4">
              {/* Voting */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('up')}
                  className={cn(
                    'hover:bg-green-500/10 hover:text-green-500',
                    userVote === 'up' && 'bg-green-500/10 text-green-500'
                  )}
                >
                  <ChevronUp className="w-4 h-4" />
                  <span className="ml-1">{localUpvotes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote('down')}
                  className={cn(
                    'hover:bg-red-500/10 hover:text-red-500',
                    userVote === 'down' && 'bg-red-500/10 text-red-500'
                  )}
                >
                  <ChevronDown className="w-4 h-4" />
                  <span className="ml-1">{localDownvotes}</span>
                </Button>
              </div>

              {/* Comments */}
              <Link to={`/post/${post.id}`}>
                <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-500">
                  <MessageSquare className="w-4 h-4" />
                  <span className="ml-1">{post.commentCount}</span>
                </Button>
              </Link>

              {/* Like */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  'hover:bg-pink-500/10 hover:text-pink-500',
                  isLiked && 'bg-pink-500/10 text-pink-500'
                )}
              >
                <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
              </Button>

              {/* Share */}
              <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                <Share className="w-4 h-4" />
              </Button>
            </div>

            {/* Tip Info & Button */}
            <div className="flex items-center space-x-3">
              {post.tipAmount > 0 && (
                <div className="text-sm text-solana-green font-medium">
                  {post.tipAmount} SOL tipped
                </div>
              )}
              <TipButton 
                postId={post.id}
                authorUsername={post.author.username}
                onTip={onTip}
                hasUserTipped={post.hasUserTipped}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
