
import { Post, User } from '@/types';

// Mock users for posts
const users: User[] = [
  {
    id: '1',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
    username: 'crypto_enthusiast',
    displayName: 'Crypto Enthusiast',
    bio: 'Building the future on Solana 🚀',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=crypto_enthusiast',
    followerCount: 1234,
    followingCount: 567,
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    walletAddress: '8yLXtg3DX98e08UKTEqcE6kCkhfTrB94UASpbJqtgBtV',
    username: 'defi_degen',
    displayName: 'DeFi Degen',
    bio: 'Yield farming across the Solana ecosystem',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=defi_degen',
    followerCount: 2890,
    followingCount: 145,
    isVerified: true,
    createdAt: '2024-02-20T08:30:00Z'
  },
  {
    id: '3',
    walletAddress: '9zMYuh4EY09f19VLTFrD7lDkifUsC95VBTqufKstgCtW',
    username: 'nft_collector',
    displayName: 'NFT Collector',
    bio: 'Collecting digital art on Solana',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nft_collector',
    followerCount: 456,
    followingCount: 890,
    isVerified: false,
    createdAt: '2024-03-10T12:15:00Z'
  },
  {
    id: '4',
    walletAddress: '5nKLth5FX20g30WMUGrE8mCkjfVsD96VCSpbKqugDuX',
    username: 'solana_dev',
    displayName: 'Solana Developer',
    bio: 'Core contributor to Solana ecosystem 🔧',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=solana_dev',
    followerCount: 5670,
    followingCount: 234,
    isVerified: true,
    createdAt: '2023-12-05T16:45:00Z'
  },
  {
    id: '5',
    walletAddress: '6oMLui6GY21h41XNVHsF9nDljgWtE97WDTrfLquiEuY',
    username: 'web3_builder',
    displayName: 'Web3 Builder',
    bio: 'Building decentralized applications',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=web3_builder',
    followerCount: 1890,
    followingCount: 567,
    isVerified: false,
    createdAt: '2024-01-28T11:20:00Z'
  },
  {
    id: '6',
    walletAddress: '7pNMvj7HZ32i52YOWItG0oEkmxXuF98XETsgMrviEvZ',
    username: 'dao_governor',
    displayName: 'DAO Governor',
    bio: 'Governance and community building enthusiast',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dao_governor',
    followerCount: 3456,
    followingCount: 789,
    isVerified: true,
    createdAt: '2023-11-18T09:30:00Z'
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    author: users[0],
    content: 'Just built my first Solana dApp! The ecosystem is incredible 🔥 The transaction speeds are mind-blowing compared to other chains. #Solana #Web3 #Building #dApp',
    mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    mediaType: 'image',
    tags: ['solana', 'web3', 'building', 'dapp'],
    upvotes: 142,
    downvotes: 8,
    commentCount: 23,
    tipAmount: 4.5,
    createdAt: '2024-01-20T14:30:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '2',
    author: users[1],
    content: 'The new Jupiter aggregator update is insane! Best DEX experience on any chain tbh 💫 Slippage is almost non-existent now. #Jupiter #DeFi #Solana #Trading',
    tags: ['jupiter', 'defi', 'solana', 'trading'],
    upvotes: 289,
    downvotes: 12,
    commentCount: 67,
    tipAmount: 18.3,
    createdAt: '2024-01-20T12:15:00Z',
    userVote: 'up',
    hasUserTipped: true
  },
  {
    id: '3',
    author: users[2],
    content: 'Found this amazing AI-generated art collection on Magic Eden. The future of creativity is here! 🎨 Each piece tells a unique story through blockchain technology.',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
    mediaType: 'image',
    tags: ['nft', 'art', 'ai', 'magiceden'],
    upvotes: 178,
    downvotes: 5,
    commentCount: 34,
    tipAmount: 7.2,
    createdAt: '2024-01-20T10:45:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '4',
    author: users[3],
    content: 'Working on a new consensus mechanism that could revolutionize blockchain scalability. Early tests show 100x improvement! 🚀 #Blockchain #Innovation #Scaling',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    mediaType: 'image',
    tags: ['blockchain', 'innovation', 'scaling', 'consensus'],
    upvotes: 456,
    downvotes: 23,
    commentCount: 89,
    tipAmount: 25.7,
    createdAt: '2024-01-20T09:20:00Z',
    userVote: 'up',
    hasUserTipped: false
  },
  {
    id: '5',
    author: users[4],
    content: 'Just deployed my first smart contract using Anchor! The developer experience on Solana is unmatched. Time to build the next big thing! #Anchor #SmartContracts #Development',
    tags: ['anchor', 'smartcontracts', 'development', 'solana'],
    upvotes: 234,
    downvotes: 7,
    commentCount: 45,
    tipAmount: 9.8,
    createdAt: '2024-01-20T08:10:00Z',
    userVote: null,
    hasUserTipped: true
  },
  {
    id: '6',
    author: users[5],
    content: 'Our DAO just reached 10,000 members! Community governance is the future of organizations. Power to the people! 🗳️ #DAO #Governance #Community #Decentralization',
    mediaUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600',
    mediaType: 'image',
    tags: ['dao', 'governance', 'community', 'decentralization'],
    upvotes: 567,
    downvotes: 18,
    commentCount: 156,
    tipAmount: 32.4,
    createdAt: '2024-01-20T07:30:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '7',
    author: users[0],
    content: 'Staking rewards on Solana are looking juicy! 📈 APY is through the roof and the network keeps getting stronger. Time to compound those gains! #Staking #Yields #Solana',
    tags: ['staking', 'yields', 'solana', 'rewards'],
    upvotes: 189,
    downvotes: 11,
    commentCount: 28,
    tipAmount: 6.1,
    createdAt: '2024-01-19T22:45:00Z',
    userVote: 'up',
    hasUserTipped: false
  },
  {
    id: '8',
    author: users[1],
    content: 'Cross-chain bridges are finally getting secure! New tech is solving the trilemma of speed, security, and decentralization. 🌉 #CrossChain #Bridges #Interoperability',
    mediaUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600',
    mediaType: 'image',
    tags: ['crosschain', 'bridges', 'interoperability', 'security'],
    upvotes: 345,
    downvotes: 15,
    commentCount: 72,
    tipAmount: 14.9,
    createdAt: '2024-01-19T20:15:00Z',
    userVote: null,
    hasUserTipped: true
  },
  {
    id: '9',
    author: users[2],
    content: 'Metaverse NFTs are evolving beyond just profile pictures. Interactive experiences and utility are the new standard! 🌐 #Metaverse #NFTs #Gaming #VirtualWorlds',
    tags: ['metaverse', 'nfts', 'gaming', 'virtualworlds'],
    upvotes: 223,
    downvotes: 9,
    commentCount: 41,
    tipAmount: 8.7,
    createdAt: '2024-01-19T18:30:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '10',
    author: users[3],
    content: 'Validator node setup complete! Contributing to network security while earning rewards. Decentralization at its finest! ⚡ #Validator #Network #Security #Decentralization',
    mediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600',
    mediaType: 'image',
    tags: ['validator', 'network', 'security', 'decentralization'],
    upvotes: 378,
    downvotes: 12,
    commentCount: 56,
    tipAmount: 19.3,
    createdAt: '2024-01-19T16:45:00Z',
    userVote: 'up',
    hasUserTipped: false
  },
  {
    id: '11',
    author: users[4],
    content: 'Web3 social media is changing how we interact online. True ownership of content and censorship resistance! 📱 #Web3Social #Decentralized #ContentOwnership',
    tags: ['web3social', 'decentralized', 'contentownership', 'censorship'],
    upvotes: 156,
    downvotes: 6,
    commentCount: 32,
    tipAmount: 5.4,
    createdAt: '2024-01-19T14:20:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '12',
    author: users[5],
    content: 'Token economics are fascinating! Studying how different mechanisms affect adoption and sustainability. Math behind money! 📊 #Tokenomics #Economics #CryptoResearch',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
    mediaType: 'image',
    tags: ['tokenomics', 'economics', 'cryptoresearch', 'sustainability'],
    upvotes: 267,
    downvotes: 14,
    commentCount: 48,
    tipAmount: 11.6,
    createdAt: '2024-01-19T12:10:00Z',
    userVote: null,
    hasUserTipped: true
  },
  {
    id: '13',
    author: users[0],
    content: 'Privacy coins are making a comeback! Zero-knowledge proofs are revolutionizing how we think about financial privacy. 🔐 #Privacy #ZKProofs #Cryptocurrency #Innovation',
    tags: ['privacy', 'zkproofs', 'cryptocurrency', 'innovation'],
    upvotes: 445,
    downvotes: 28,
    commentCount: 93,
    tipAmount: 22.1,
    createdAt: '2024-01-19T10:35:00Z',
    userVote: 'up',
    hasUserTipped: false
  },
  {
    id: '14',
    author: users[1],
    content: 'Layer 2 solutions are scaling Ethereum, but Solana is still faster out of the box! Competition breeds innovation 🏃‍♂️ #Layer2 #Scaling #Performance #Competition',
    mediaUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600',
    mediaType: 'image',
    tags: ['layer2', 'scaling', 'performance', 'competition'],
    upvotes: 334,
    downvotes: 42,
    commentCount: 78,
    tipAmount: 16.8,
    createdAt: '2024-01-19T08:50:00Z',
    userVote: null,
    hasUserTipped: false
  },
  {
    id: '15',
    author: users[2],
    content: 'Digital identity on blockchain is the future! Self-sovereign identity gives users control over their data. 🆔 #DigitalIdentity #SelfSovereign #Privacy #Blockchain',
    tags: ['digitalidentity', 'selfsovereign', 'privacy', 'blockchain'],
    upvotes: 198,
    downvotes: 8,
    commentCount: 35,
    tipAmount: 7.9,
    createdAt: '2024-01-18T22:15:00Z',
    userVote: null,
    hasUserTipped: true
  }
];

export const getPostsByHashtag = (hashtag: string): Post[] => {
  return mockPosts.filter(post => 
    post.tags.some(tag => tag.toLowerCase().includes(hashtag.toLowerCase()))
  );
};

export const searchPosts = (query: string): Post[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockPosts.filter(post => 
    post.content.toLowerCase().includes(lowercaseQuery) ||
    post.author.displayName.toLowerCase().includes(lowercaseQuery) ||
    post.author.username.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getTrendingHashtags = (): string[] => {
  const tagCounts: { [key: string]: number } = {};
  
  mockPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag]) => tag);
};
