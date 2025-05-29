
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, User, Bell, Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Feed', href: '/', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Following', href: '/following', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.aside 
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:block w-64 h-screen sticky top-16 overflow-y-auto bg-card/50 backdrop-blur-sm border-r border-border"
    >
      <div className="p-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.name} to={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Trending Tags */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 px-4">
            Trending Tags
          </h3>
          <div className="space-y-2">
            {['#solana', '#web3', '#defi', '#nft', '#gaming'].map((tag) => (
              <motion.div
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 bg-card rounded-lg border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">
            Network Stats
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Posts</span>
              <span className="text-foreground">12.4k</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Users</span>
              <span className="text-foreground">3.2k</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tips</span>
              <span className="text-solana-green">142 SOL</span>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};
