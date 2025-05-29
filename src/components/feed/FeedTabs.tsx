
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const FeedTabs: React.FC<FeedTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'trending', label: 'Trending', emoji: '🔥' },
    { id: 'following', label: 'Following', emoji: '👥' },
    { id: 'hot', label: 'Hot', emoji: '⚡' },
    { id: 'new', label: 'New', emoji: '✨' },
  ];

  return (
    <div className="sticky top-16 z-40 backdrop-blur-lg bg-background/80 border-b border-border p-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id}
              value={tab.id}
              className="relative data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2"
              >
                <span>{tab.emoji}</span>
                <span className="hidden sm:block">{tab.label}</span>
              </motion.div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
