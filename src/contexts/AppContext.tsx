
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Post, Comment, Notification } from '@/types';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  notifications: Notification[];
  setNotifications: (notifications: Notification[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Mock data
const mockUser: User = {
  id: '1',
  walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
  username: 'crypto_enthusiast',
  displayName: 'Crypto Enthusiast',
  bio: 'Building the future on Solana 🚀',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  followerCount: 1234,
  followingCount: 567,
  isVerified: true,
  createdAt: '2024-01-15T10:00:00Z'
};

const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUser,
    content: 'Just built my first Solana dApp! The ecosystem is incredible 🔥 #Solana #Web3 #Building',
    mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    mediaType: 'image',
    tags: ['solana', 'web3', 'building'],
    upvotes: 42,
    downvotes: 3,
    commentCount: 12,
    tipAmount: 2.5,
    createdAt: '2024-01-20T14:30:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '2',
    author: {
      ...mockUser,
      id: '2',
      username: 'defi_degen',
      displayName: 'DeFi Degen',
      bio: 'Yield farming across the Solana ecosystem',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    content: 'The new Jupiter aggregator update is insane! Best DEX experience on any chain tbh 💫',
    tags: ['jupiter', 'defi', 'solana'],
    upvotes: 128,
    downvotes: 8,
    commentCount: 34,
    tipAmount: 12.8,
    createdAt: '2024-01-20T12:15:00Z',
    userVote: 'up',
    hasUserTipped: true
  },
  {
    id: '3',
    author: {
      ...mockUser,
      id: '3',
      username: 'nft_collector',
      displayName: 'NFT Collector',
      bio: 'Collecting digital art on Solana',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
    },
    content: 'Found this amazing AI-generated art collection on Magic Eden. The future of creativity is here! 🎨',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
    mediaType: 'image',
    tags: ['nft', 'art', 'ai'],
    upvotes: 67,
    downvotes: 2,
    commentCount: 18,
    tipAmount: 5.2,
    createdAt: '2024-01-20T10:45:00Z',
    userVote: null,
    hasUserTipped: false
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      posts,
      setPosts,
      notifications,
      setNotifications,
      isLoading,
      setIsLoading
    }}>
      {children}
    </AppContext.Provider>
  );
};
