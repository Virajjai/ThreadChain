
export interface User {
  id: string;
  walletAddress: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  followerCount: number;
  followingCount: number;
  isVerified: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  tags: string[];
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tipAmount: number;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
  hasUserTipped?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  createdAt: string;
  userVote?: 'up' | 'down' | null;
  parentId?: string;
}

export interface Notification {
  id: string;
  type: 'tip' | 'vote' | 'comment' | 'follow';
  fromUser: User;
  amount?: number;
  postId?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface TipTransaction {
  id: string;
  fromUser: User;
  toUser: User;
  amount: number;
  postId?: string;
  signature: string;
  createdAt: string;
}
