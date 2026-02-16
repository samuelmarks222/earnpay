import MainLayout from "@/components/layout/MainLayout";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import EarningsWidget from "@/components/feed/EarningsWidget";
import { posts } from "@/lib/mock-data";

const Index = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Feed */}
        <div className="space-y-4">
          <CreatePost />
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Right Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-[72px]">
            <EarningsWidget />
          </div>
        </aside>
      </div>
    </MainLayout>
  );
};

export default Index;
