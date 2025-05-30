
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bell, Settings, Users, Hash, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Card, CardContent } from '@/components/ui/card';
import { getTrendingHashtags } from '@/data/posts';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const navigationItems = [
  { name: 'Feed', href: '/', icon: Home },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Following', href: '/following', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const AppSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const { setSelectedHashtag, setSearchQuery } = useApp();
  const trendingTags = getTrendingHashtags();
  
  const isCollapsed = state === 'collapsed';

  const handleTagClick = (tag: string) => {
    setSelectedHashtag(tag);
    setSearchQuery('');
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarContent className="bg-card/50 backdrop-blur-sm">
        {/* Navigation Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? item.name : undefined}
                    >
                      <Link to={item.href} className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trending Tags */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              Trending Tags
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-2 px-2">
                {trendingTags.slice(0, 5).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-accent/50 transition-colors text-left group text-sm"
                  >
                    <Hash className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">
                      {tag}
                    </span>
                  </button>
                ))}
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Network Stats */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <Card className="mx-2 border-border/50">
                <CardContent className="p-4">
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
                      <span className="text-emerald-500">142 SOL</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
