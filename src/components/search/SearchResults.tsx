
import React from 'react';
import { motion } from 'framer-motion';
import { User, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Post } from '@/types';

interface SearchResultsProps {
  query: string;
  posts: Post[];
  profiles: any[];
  isLoading: boolean;
  onClose: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  posts,
  profiles,
  isLoading,
  onClose
}) => {
  if (!query && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 p-6"
      >
        <div className="text-center text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2" />
          <p>Start typing to search posts, users, and hashtags...</p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 p-6"
      >
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Searching...</p>
        </div>
      </motion.div>
    );
  }

  const hasResults = posts.length > 0 || profiles.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {!hasResults ? (
        <div className="p-6 text-center text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2" />
          <p>No results found for "{query}"</p>
          <p className="text-sm mt-1">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Users Section */}
          {profiles.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Users
              </h3>
              <div className="space-y-2">
                {profiles.slice(0, 3).map((profile) => (
                  <Card key={profile.id} className="p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={profile.avatar} alt={profile.display_name} />
                        <AvatarFallback>{profile.display_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium truncate">{profile.display_name}</p>
                          {profile.is_verified && (
                            <Badge variant="secondary" className="text-xs">Verified</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {posts.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Posts</h3>
              <div className="space-y-2">
                {posts.slice(0, 5).map((post) => (
                  <Card key={post.id} className="p-3 hover:bg-accent/50 cursor-pointer transition-colors">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={post.author.avatar} alt={post.author.displayName} />
                        <AvatarFallback>{post.author.displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{post.author.displayName}</span>
                          <span className="text-xs text-muted-foreground">@{post.author.username}</span>
                        </div>
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>{post.upvotes} upvotes</span>
                          <span>{post.commentCount} comments</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* View All Results */}
          <div className="pt-2 border-t">
            <Button 
              variant="ghost" 
              className="w-full text-sm"
              onClick={onClose}
            >
              View all results for "{query}"
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
