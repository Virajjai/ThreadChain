
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageCircle, UserPlus, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Notifications = () => {
  const { notifications, setNotifications } = useApp();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'tip':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'vote':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const mockNotifications = [
    {
      id: '1',
      type: 'tip',
      fromUser: {
        id: '2',
        walletAddress: '8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        username: 'crypto_tipper',
        displayName: 'Crypto Tipper',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: '',
        followerCount: 0,
        followingCount: 0,
        isVerified: false,
        createdAt: new Date().toISOString()
      },
      amount: 0.5,
      message: 'tipped your post 0.5 SOL',
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: false
    },
    {
      id: '2',
      type: 'vote',
      fromUser: {
        id: '3',
        walletAddress: '9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
        username: 'vote_lover',
        displayName: 'Vote Lover',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        bio: '',
        followerCount: 0,
        followingCount: 0,
        isVerified: true,
        createdAt: new Date().toISOString()
      },
      message: 'upvoted your post',
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: false
    }
  ];

  const allNotifications = [...mockNotifications, ...notifications];

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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gradient">Notifications</h1>
              {allNotifications.some(n => !n.isRead) && (
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  Mark all as read
                </Button>
              )}
            </div>

            <div className="space-y-4">
              {allNotifications.length > 0 ? (
                allNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`glass cursor-pointer transition-all hover:scale-[1.02] ${
                        !notification.isRead ? 'border-primary/50 bg-primary/5' : 'border-border/50'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={notification.fromUser.avatar} alt={notification.fromUser.displayName} />
                            <AvatarFallback>{notification.fromUser.displayName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              {getNotificationIcon(notification.type)}
                              <span className="font-medium">{notification.fromUser.displayName}</span>
                              {notification.fromUser.isVerified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                              {notification.amount && (
                                <span className="font-medium text-green-500 ml-1">
                                  {notification.amount} SOL
                                </span>
                              )}
                            </p>
                            
                            <p className="text-xs text-muted-foreground">
                              {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                              {new Date(notification.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {!notification.isRead && (
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No notifications yet.</p>
                  <p className="text-sm text-muted-foreground">When someone interacts with your posts, you'll see it here.</p>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Notifications;
