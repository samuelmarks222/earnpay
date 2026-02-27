import { useState, useEffect, useCallback, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import StoriesRow from "@/components/feed/StoriesRow";
import RightSidebar from "@/components/feed/RightSidebar";
import ReelInterstitial from "@/components/feed/ReelInterstitial";
import FeedFriendSuggestions from "@/components/feed/FeedFriendSuggestions";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEarnings } from "@/hooks/useEarnings";

type Post = any;

const FEED_PAGE_SIZE = 10;
const REEL_INTERVAL = 4; // Show a reel every N posts
const FRIEND_SUGGESTION_INTERVAL = 10; // Show suggestions every N posts

const Index = () => {
  const { user } = useAuth();
  const { awardSEP } = useEarnings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const loginStreakGiven = useRef(false);

  const fetchPosts = useCallback(async (pageNum: number, reset = false) => {
    if (pageNum === 0) setLoading(true); else setLoadingMore(true);

    const from = pageNum * FEED_PAGE_SIZE;
    const to = from + FEED_PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_id_fkey(id, full_name, avatar_url, username)')
      .eq('privacy', 'public')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      const newPosts = data as unknown as Post[];
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === FEED_PAGE_SIZE);
    } else {
      // Stop infinite scroll on error
      setHasMore(false);
    }

    if (pageNum === 0) setLoading(false); else setLoadingMore(false);
  }, []);

  // Fetch reels (posts with post_type = 'reel' or video posts)
  const fetchReels = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*, profiles!posts_author_id_fkey(id, full_name, avatar_url, username)')
      .in('post_type', ['reel', 'video'])
      .eq('privacy', 'public')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setReels(data);
  }, []);

  useEffect(() => {
    fetchPosts(0, true);
    fetchReels();
    if (user && !loginStreakGiven.current) {
      loginStreakGiven.current = true;
      awardSEP('daily_login', undefined, 'Daily login bonus');
    }
  }, [fetchPosts, fetchReels, user]);

  // Infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        setPage(p => p + 1);
      }
    }, { threshold: 0.1 });

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore]);

  useEffect(() => {
    if (page > 0) fetchPosts(page);
  }, [page, fetchPosts]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('feed-posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, () => {
        fetchPosts(0, true);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const handlePostCreated = () => {
    setPage(0);
    fetchPosts(0, true);
  };

  // Build interleaved feed items
  const buildFeedItems = () => {
    const items: { type: 'post' | 'reel' | 'suggestions'; data?: any; key: string }[] = [];
    let reelIndex = 0;
    let suggestionShown = false;

    posts.forEach((post, i) => {
      items.push({ type: 'post', data: post, key: post.id });

      // Insert reel after every REEL_INTERVAL posts
      if ((i + 1) % REEL_INTERVAL === 0 && reels[reelIndex]) {
        items.push({ type: 'reel', data: reels[reelIndex], key: `reel-${reelIndex}` });
        reelIndex++;
      }

      // Insert friend suggestions after FRIEND_SUGGESTION_INTERVAL posts
      if ((i + 1) % FRIEND_SUGGESTION_INTERVAL === 0 && !suggestionShown) {
        items.push({ type: 'suggestions', key: `suggestions-${i}` });
        suggestionShown = true;
      }
    });

    return items;
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-3">
          <CreatePost onPostCreated={handlePostCreated} />
          <StoriesRow />

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-xl font-medium">No posts yet!</p>
              <p className="mt-2">Be the first to share something.</p>
            </div>
          ) : (
            buildFeedItems().map(item => {
              if (item.type === 'reel') {
                const reel = item.data;
                const reelFormatted = {
                  id: reel.id,
                  author: {
                    name: reel.profiles?.full_name || 'User',
                    avatar: reel.profiles?.avatar_url || '',
                  },
                  thumbnail: reel.media_urls?.[0] || 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=500&fit=crop',
                  viewsCount: reel.views_count || 0,
                  likesCount: reel.reactions_count || 0,
                  commentsCount: reel.comments_count || 0,
                  description: reel.content || '',
                  earnedSEP: reel.sep_earned || 0,
                };
                return <ReelInterstitial key={item.key} reel={reelFormatted} />;
              }
              if (item.type === 'suggestions') {
                return <FeedFriendSuggestions key={item.key} />;
              }
              return <PostCard key={item.key} post={item.data} />;
            })
          )}

          {/* Infinite scroll trigger */}
          <div ref={loadMoreRef} className="py-4 flex justify-center">
            {loadingMore && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
          </div>
        </div>
        <div className="hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
