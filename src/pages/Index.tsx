import MainLayout from "@/components/layout/MainLayout";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import StoriesRow from "@/components/feed/StoriesRow";
import FriendRequests from "@/components/feed/FriendRequests";
import EarningsWidget from "@/components/feed/EarningsWidget";
import { posts } from "@/lib/mock-data";

const Index = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-3">
          <CreatePost />
          <StoriesRow />
          <FriendRequests />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        <aside className="hidden lg:block">
          <div className="sticky top-[110px]">
            <EarningsWidget />
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default Index;
