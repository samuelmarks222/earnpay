import MainLayout from "@/components/layout/MainLayout";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";
import StoriesRow from "@/components/feed/StoriesRow";
import FriendRequests from "@/components/feed/FriendRequests";
import EarningsWidget from "@/components/feed/EarningsWidget";
import ReelInterstitial from "@/components/feed/ReelInterstitial";
import { posts, reels } from "@/lib/mock-data";

const Index = () => {
  // Build feed items with reels interleaved every 3 posts
  const feedItems: { type: "post" | "reel"; data: any }[] = [];
  let reelIndex = 0;

  posts.forEach((post, i) => {
    feedItems.push({ type: "post", data: post });
    if ((i + 1) % 3 === 0 && reelIndex < reels.length) {
      feedItems.push({ type: "reel", data: reels[reelIndex] });
      reelIndex++;
    }
  });

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-3">
          <CreatePost />
          <StoriesRow />
          <FriendRequests />
          {feedItems.map((item, i) =>
            item.type === "post" ? (
              <PostCard key={item.data.id} post={item.data} />
            ) : (
              <ReelInterstitial key={`reel-${item.data.id}`} reel={item.data} />
            )
          )}
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
