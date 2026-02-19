// Shared post type for the feed
export interface Post {
  id: string;
  author_id: string;
  content: string | null;
  post_type: string;
  media_urls: string[];
  privacy: string;
  is_sponsored: boolean;
  sponsor_name: string | null;
  reactions_count: number;
  comments_count: number;
  shares_count: number;
  sep_earned: number;
  created_at: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    username: string | null;
  } | null;
}
