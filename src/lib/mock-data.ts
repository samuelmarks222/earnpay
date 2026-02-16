export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  work?: string;
  friendsCount: number;
  followersCount: number;
  totalEarnings: number;
  joinedDate: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  createdAt: string;
  reactions: { type: string; count: number }[];
  totalReactions: number;
  commentsCount: number;
  sharesCount: number;
  earnedSEP: number;
}

export interface EarningEntry {
  date: string;
  posts: number;
  engagement: number;
  ads: number;
  streaks: number;
}

export const currentUser: User = {
  id: "1",
  name: "Alex Rivera",
  username: "alexrivera",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
  coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  bio: "Tech enthusiast | Creator | Building the future one post at a time 🚀",
  location: "San Francisco, CA",
  work: "Product Designer at TechCo",
  friendsCount: 1247,
  followersCount: 3891,
  totalEarnings: 2847.5,
  joinedDate: "2023-01-15",
};

export const users: User[] = [
  currentUser,
  {
    id: "2", name: "Sarah Chen", username: "sarahchen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    friendsCount: 892, followersCount: 2103, totalEarnings: 1523.0, joinedDate: "2023-03-20",
  },
  {
    id: "3", name: "Marcus Johnson", username: "marcusj",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    friendsCount: 634, followersCount: 1560, totalEarnings: 987.25, joinedDate: "2023-05-10",
  },
  {
    id: "4", name: "Priya Patel", username: "priyap",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    friendsCount: 1105, followersCount: 4230, totalEarnings: 4102.75, joinedDate: "2023-02-01",
  },
  {
    id: "5", name: "James Wilson", username: "jameswilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    friendsCount: 456, followersCount: 890, totalEarnings: 623.0, joinedDate: "2023-07-12",
  },
];

export const posts: Post[] = [
  {
    id: "p1",
    author: users[1],
    content: "Just launched my new design system! After 3 months of work, it's finally live. Check it out and let me know what you think 🎨✨ #design #ux #creative",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop",
    createdAt: "2 hours ago",
    reactions: [{ type: "❤️", count: 124 }, { type: "🔥", count: 45 }, { type: "👏", count: 32 }],
    totalReactions: 201,
    commentsCount: 47,
    sharesCount: 23,
    earnedSEP: 45.5,
  },
  {
    id: "p2",
    author: users[2],
    content: "Morning coffee and code. There's nothing like solving a tricky bug before 9 AM. What's your morning routine? ☕💻",
    createdAt: "4 hours ago",
    reactions: [{ type: "❤️", count: 89 }, { type: "😂", count: 12 }],
    totalReactions: 101,
    commentsCount: 34,
    sharesCount: 8,
    earnedSEP: 22.0,
  },
  {
    id: "p3",
    author: users[3],
    content: "Excited to announce I just hit 4,000 SEP! 🎉 The earning system on SocialEarn is genuinely rewarding. My content is finally being valued. Thank you to everyone who engages with my posts!",
    createdAt: "6 hours ago",
    reactions: [{ type: "❤️", count: 312 }, { type: "🔥", count: 89 }, { type: "👏", count: 67 }, { type: "🎉", count: 45 }],
    totalReactions: 513,
    commentsCount: 92,
    sharesCount: 56,
    earnedSEP: 125.0,
  },
  {
    id: "p4",
    author: users[4],
    content: "Hot take: Remote work isn't going anywhere. The companies forcing return-to-office are going to lose their best talent. What do you think?",
    createdAt: "8 hours ago",
    reactions: [{ type: "❤️", count: 67 }, { type: "🔥", count: 34 }, { type: "🤔", count: 23 }],
    totalReactions: 124,
    commentsCount: 78,
    sharesCount: 15,
    earnedSEP: 31.5,
  },
  {
    id: "p5",
    author: currentUser,
    content: "Just explored the new earnings dashboard — love how transparent SocialEarn is about revenue sharing. This is how social media should work! 💚",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    createdAt: "12 hours ago",
    reactions: [{ type: "❤️", count: 156 }, { type: "👏", count: 42 }],
    totalReactions: 198,
    commentsCount: 53,
    sharesCount: 31,
    earnedSEP: 67.0,
  },
];

export const weeklyEarnings: EarningEntry[] = [
  { date: "Mon", posts: 12, engagement: 8, ads: 5, streaks: 2 },
  { date: "Tue", posts: 18, engagement: 12, ads: 8, streaks: 2 },
  { date: "Wed", posts: 8, engagement: 15, ads: 3, streaks: 2 },
  { date: "Thu", posts: 22, engagement: 10, ads: 10, streaks: 2 },
  { date: "Fri", posts: 30, engagement: 18, ads: 12, streaks: 5 },
  { date: "Sat", posts: 15, engagement: 22, ads: 6, streaks: 5 },
  { date: "Sun", posts: 10, engagement: 14, ads: 4, streaks: 10 },
];

export const earningStats = {
  todayEarnings: 34.5,
  lifetimeEarnings: 2847.5,
  pendingBalance: 67.25,
  availableBalance: 2780.25,
  loginStreak: 14,
  topPostEarnings: 125.0,
  weeklyTotal: 287.0,
  monthlyTotal: 1124.5,
};

export const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🔥", "👏"];
