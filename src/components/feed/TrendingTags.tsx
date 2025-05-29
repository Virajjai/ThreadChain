
import React from 'react';
import { motion } from 'framer-motion';
import { Hash, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getTrendingHashtags } from '@/data/posts';

interface TrendingTagsProps {
  onTagClick: (tag: string) => void;
}

export const TrendingTags: React.FC<TrendingTagsProps> = ({ onTagClick }) => {
  const trendingTags = getTrendingHashtags();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="glass border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Trending Tags</h3>
          </div>
          <div className="space-y-2">
            {trendingTags.map((tag, index) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onTagClick(tag)}
                className="flex items-center space-x-2 w-full p-2 rounded-lg hover:bg-accent/50 transition-colors text-left group"
              >
                <Hash className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm group-hover:text-primary transition-colors">
                  {tag}
                </span>
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
