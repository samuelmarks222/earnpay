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
  isOnline?: boolean;
  mutualFriends?: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  image?: string;
  video?: string;
  createdAt: string;
  reactions: { type: string; count: number }[];
  totalReactions: number;
  commentsCount: number;
  sharesCount: number;
  earnedSEP: number;
  isFollowable?: boolean;
  viewsCount?: number;
  privacy?: "public" | "friends" | "private";
}

export interface Story {
  id: string;
  user: User;
  image: string;
  unreadCount: number;
  isOwn?: boolean;
}

export interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  timeAgo: string;
}

export interface Group {
  id: string;
  name: string;
  cover: string;
  membersCount: number;
  postsToday: number;
  description: string;
  isJoined: boolean;
}

export interface Page {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  likesCount: number;
  category: string;
  isLiked: boolean;
}

export interface Reel {
  id: string;
  author: User;
  thumbnail: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  description: string;
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
  isOnline: true,
};

export const users: User[] = [
  currentUser,
  {
    id: "2", name: "Sarah Chen", username: "sarahchen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    friendsCount: 892, followersCount: 2103, totalEarnings: 1523.0, joinedDate: "2023-03-20", isOnline: true,
  },
  {
    id: "3", name: "Marcus Johnson", username: "marcusj",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    friendsCount: 634, followersCount: 1560, totalEarnings: 987.25, joinedDate: "2023-05-10", isOnline: false,
  },
  {
    id: "4", name: "Priya Patel", username: "priyap",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    friendsCount: 1105, followersCount: 4230, totalEarnings: 4102.75, joinedDate: "2023-02-01", isOnline: true,
  },
  {
    id: "5", name: "James Wilson", username: "jameswilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    friendsCount: 456, followersCount: 890, totalEarnings: 623.0, joinedDate: "2023-07-12", isOnline: false,
  },
  {
    id: "6", name: "Amina Okafor", username: "aminao",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    friendsCount: 2340, followersCount: 5120, totalEarnings: 3200.0, joinedDate: "2023-01-05", isOnline: true,
  },
  {
    id: "7", name: "David Kim", username: "davidkim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    friendsCount: 780, followersCount: 1890, totalEarnings: 1450.0, joinedDate: "2023-04-18", isOnline: false,
  },
  {
    id: "8", name: "Lisa Martinez", username: "lisamart",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    friendsCount: 1560, followersCount: 3450, totalEarnings: 2890.0, joinedDate: "2023-02-22", isOnline: true,
  },
];

export const stories: Story[] = [
  { id: "s0", user: currentUser, image: currentUser.avatar, unreadCount: 1, isOwn: true },
  { id: "s1", user: users[1], image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=300&fit=crop", unreadCount: 1 },
  { id: "s2", user: users[2], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop", unreadCount: 1 },
  { id: "s3", user: users[3], image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=300&fit=crop", unreadCount: 6 },
  { id: "s4", user: users[5], image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=300&fit=crop", unreadCount: 3 },
  { id: "s5", user: users[6], image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=300&fit=crop", unreadCount: 2 },
];

export const friendRequests: FriendRequest[] = [
  { id: "fr1", user: users[6], mutualFriends: 2, timeAgo: "3d" },
  { id: "fr2", user: users[7], mutualFriends: 5, timeAgo: "1w" },
  { id: "fr3", user: users[5], mutualFriends: 8, timeAgo: "2d" },
];

export const groups: Group[] = [
  { id: "g1", name: "Tech Entrepreneurs Hub", cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop", membersCount: 15400, postsToday: 34, description: "A community for tech founders and innovators", isJoined: true },
  { id: "g2", name: "Creative Designers", cover: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=200&fit=crop", membersCount: 8920, postsToday: 18, description: "Share your designs and get feedback", isJoined: true },
  { id: "g3", name: "Fitness & Wellness", cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=200&fit=crop", membersCount: 24100, postsToday: 56, description: "Workout tips, nutrition, and motivation", isJoined: false },
  { id: "g4", name: "Photography Masters", cover: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=200&fit=crop", membersCount: 12300, postsToday: 42, description: "Share your best shots and learn from others", isJoined: false },
  { id: "g5", name: "Book Club", cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=200&fit=crop", membersCount: 6700, postsToday: 12, description: "Discuss your latest reads", isJoined: true },
  { id: "g6", name: "Digital Nomads", cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop", membersCount: 19800, postsToday: 28, description: "Work from anywhere lifestyle", isJoined: false },
];

export const pages: Page[] = [
  { id: "pg1", name: "TechVibe", avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop", likesCount: 45200, category: "Technology", isLiked: true },
  { id: "pg2", name: "Travel Diaries", avatar: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop", likesCount: 123400, category: "Travel", isLiked: false },
  { id: "pg3", name: "Foodie Paradise", avatar: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop", likesCount: 89100, category: "Food & Drink", isLiked: true },
  { id: "pg4", name: "Sports Zone", avatar: "https://images.unsplash.com/photo-1461896836934-bd45ba34ce08?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1461896836934-bd45ba34ce08?w=400&h=200&fit=crop", likesCount: 67800, category: "Sports", isLiked: false },
  { id: "pg5", name: "Music Vibes", avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop", cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop", likesCount: 234500, category: "Music", isLiked: false },
];

export const reels: Reel[] = [
  { id: "r1", author: users[1], thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=500&fit=crop", viewsCount: 33000, likesCount: 2400, commentsCount: 189, description: "New design system launch! 🎨✨", earnedSEP: 125 },
  { id: "r2", author: users[3], thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=500&fit=crop", viewsCount: 87000, likesCount: 5600, commentsCount: 342, description: "Morning workout routine 💪", earnedSEP: 340 },
  { id: "r3", author: users[5], thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=500&fit=crop", viewsCount: 12000, likesCount: 890, commentsCount: 67, description: "Recipe of the day 🍕", earnedSEP: 56 },
  { id: "r4", author: users[2], thumbnail: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=300&h=500&fit=crop", viewsCount: 45000, likesCount: 3200, commentsCount: 234, description: "Sunset photography tips 📸", earnedSEP: 210 },
  { id: "r5", author: users[4], thumbnail: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=500&fit=crop", viewsCount: 21000, likesCount: 1500, commentsCount: 98, description: "Travel vlog from Bali 🌴", earnedSEP: 89 },
  { id: "r6", author: users[6], thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=500&fit=crop", viewsCount: 56000, likesCount: 4100, commentsCount: 278, description: "Guitar cover 🎸🔥", earnedSEP: 267 },
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
    privacy: "public",
  },
  {
    id: "p2",
    author: users[5],
    content: "With the team at the annual tech summit! Amazing connections made today 🙌",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    ],
    createdAt: "2d",
    reactions: [{ type: "❤️", count: 312 }, { type: "👏", count: 89 }],
    totalReactions: 401,
    commentsCount: 67,
    sharesCount: 34,
    earnedSEP: 89,
    isFollowable: true,
    privacy: "public",
  },
  {
    id: "p3",
    author: users[2],
    content: "Morning coffee and code. There's nothing like solving a tricky bug before 9 AM. What's your morning routine? ☕💻",
    createdAt: "4 hours ago",
    reactions: [{ type: "❤️", count: 89 }, { type: "😂", count: 12 }],
    totalReactions: 101,
    commentsCount: 34,
    sharesCount: 8,
    earnedSEP: 22.0,
    privacy: "friends",
  },
  {
    id: "p4",
    author: users[3],
    content: "Excited to announce I just hit 4,000 SEP! 🎉 The earning system on SocialEarn is genuinely rewarding. My content is finally being valued. Thank you to everyone who engages with my posts!",
    createdAt: "6 hours ago",
    reactions: [{ type: "❤️", count: 312 }, { type: "🔥", count: 89 }, { type: "👏", count: 67 }, { type: "🎉", count: 45 }],
    totalReactions: 513,
    commentsCount: 92,
    sharesCount: 56,
    earnedSEP: 125.0,
    privacy: "public",
  },
  {
    id: "p5",
    author: users[7],
    content: "Waah 😂😂",
    images: [
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=500&fit=crop",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=500&fit=crop",
    ],
    createdAt: "1d",
    reactions: [{ type: "👍", count: 903 }],
    totalReactions: 903,
    commentsCount: 139,
    sharesCount: 3,
    earnedSEP: 78,
    isFollowable: true,
    viewsCount: 33000,
    privacy: "public",
  },
  {
    id: "p6",
    author: users[4],
    content: "Hot take: Remote work isn't going anywhere. The companies forcing return-to-office are going to lose their best talent. What do you think?",
    createdAt: "8 hours ago",
    reactions: [{ type: "❤️", count: 67 }, { type: "🔥", count: 34 }, { type: "🤔", count: 23 }],
    totalReactions: 124,
    commentsCount: 78,
    sharesCount: 15,
    earnedSEP: 31.5,
    privacy: "public",
  },
  {
    id: "p7",
    author: currentUser,
    content: "Just explored the new earnings dashboard — love how transparent SocialEarn is about revenue sharing. This is how social media should work! 💚",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    createdAt: "12 hours ago",
    reactions: [{ type: "❤️", count: 156 }, { type: "👏", count: 42 }],
    totalReactions: 198,
    commentsCount: 53,
    sharesCount: 31,
    earnedSEP: 67.0,
    privacy: "public",
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
