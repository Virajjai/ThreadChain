
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Wallet, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useWallet } from '@solana/wallet-adapter-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useApp } from '@/contexts/AppContext';

const Settings = () => {
  const { disconnect, wallet, connected } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const { currentUser } = useApp();
  
  const [notifications, setNotifications] = useState({
    tips: true,
    votes: true,
    comments: true,
    follows: true,
    email: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    showWallet: false,
    showStats: true
  });

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const settingSections = [
    {
      title: 'Account',
      icon: User,
      settings: [
        {
          label: 'Profile Settings',
          description: 'Update your profile information',
          action: (
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          )
        }
      ]
    },
    {
      title: 'Wallet',
      icon: Wallet,
      settings: [
        {
          label: 'Connected Wallet',
          description: connected ? `${wallet?.adapter.name}: ${currentUser?.walletAddress?.slice(0, 8)}...` : 'No wallet connected',
          action: connected ? (
            <Button variant="destructive" size="sm" onClick={handleDisconnect}>
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              Connect Wallet
            </Button>
          )
        }
      ]
    },
    {
      title: 'Appearance',
      icon: theme === 'dark' ? Moon : Sun,
      settings: [
        {
          label: 'Dark Mode',
          description: 'Switch between light and dark themes',
          action: (
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          )
        }
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        {
          label: 'Tip Notifications',
          description: 'Get notified when someone tips your posts',
          action: (
            <Switch
              checked={notifications.tips}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, tips: checked }))}
            />
          )
        },
        {
          label: 'Vote Notifications',
          description: 'Get notified when someone votes on your posts',
          action: (
            <Switch
              checked={notifications.votes}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, votes: checked }))}
            />
          )
        },
        {
          label: 'Comment Notifications',
          description: 'Get notified when someone comments on your posts',
          action: (
            <Switch
              checked={notifications.comments}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, comments: checked }))}
            />
          )
        },
        {
          label: 'Follow Notifications',
          description: 'Get notified when someone follows you',
          action: (
            <Switch
              checked={notifications.follows}
              onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, follows: checked }))}
            />
          )
        }
      ]
    },
    {
      title: 'Privacy',
      icon: Shield,
      settings: [
        {
          label: 'Public Profile',
          description: 'Make your profile visible to everyone',
          action: (
            <Switch
              checked={privacy.publicProfile}
              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, publicProfile: checked }))}
            />
          )
        },
        {
          label: 'Show Wallet Address',
          description: 'Display your wallet address on your profile',
          action: (
            <Switch
              checked={privacy.showWallet}
              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showWallet: checked }))}
            />
          )
        },
        {
          label: 'Show Statistics',
          description: 'Display your stats on your profile',
          action: (
            <Switch
              checked={privacy.showStats}
              onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showStats: checked }))}
            />
          )
        }
      ]
    }
  ];

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
            <h1 className="text-3xl font-bold text-gradient flex items-center space-x-2">
              <SettingsIcon className="w-8 h-8" />
              <span>Settings</span>
            </h1>

            <div className="space-y-6">
              {settingSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                >
                  <Card className="glass border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <section.icon className="w-5 h-5" />
                        <span>{section.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section.settings.map((setting, settingIndex) => (
                        <div key={settingIndex} className="flex items-center justify-between p-4 rounded-lg bg-card/50">
                          <div className="flex-1">
                            <Label className="text-sm font-medium">{setting.label}</Label>
                            <p className="text-xs text-muted-foreground mt-1">{setting.description}</p>
                          </div>
                          <div className="ml-4">
                            {setting.action}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end"
            >
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                Save Changes
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
