import { useState, useEffect, useCallback, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import StoriesRow from "@/components/feed/StoriesRow";
import RightSidebar from "@/components/feed/RightSidebar";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useEarnings } from "@/hooks/useEarnings";

type Post = any;

const FEED_PAGE_SIZE = 10;

const Index = () => {
  const { user } = useAuth();
  const { awardSEP } = useEarnings();
  const [posts, setPosts] = useState<Post[]>([]);
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
      .select('*, profiles(id, full_name, avatar_url, username)')
      .eq('privacy', 'public')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (!error && data) {
      const newPosts = data as unknown as Post[];
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(newPosts.length === FEED_PAGE_SIZE);
    }

    if (pageNum === 0) setLoading(false); else setLoadingMore(false);
  }, []);

  useEffect(() => {
    fetchPosts(0, true);
    // Award daily login SEP
    if (user && !loginStreakGiven.current) {
      loginStreakGiven.current = true;
      awardSEP('daily_login', undefined, 'Daily login bonus');
    }
  }, [fetchPosts, user]);

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
            posts.map(post => <PostCard key={post.id} post={post} />)
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
