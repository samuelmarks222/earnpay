import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Play, Eye, Heart, MessageCircle, Share2, Bookmark, Search, Coins, ThumbsUp } from "lucide-react";
import { reels, posts } from "@/lib/mock-data";

const formatCount = (n: number) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n));

const tabs = ["For You", "Live", "Reels", "Saved"];

const Watch = () => {
  const [activeTab, setActiveTab] = useState("For You");
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Video posts from the feed
  const videoPosts = posts.filter((p) => p.image || p.images);

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Watch</h1>
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search videos..." className="pl-9 rounded-full bg-secondary border-0" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "secondary"}
              size="sm"
              className="shrink-0 rounded-full text-xs"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Coins className="h-4 w-4 text-primary" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">Earn 1 SEP</span> per minute watching (max 30 min/day). Full reel watches earn <span className="font-semibold">1 SEP</span> each!
          </p>
        </div>

        {/* Reels Row */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Trending Reels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {reels.map((reel) => (
              <Card key={reel.id} className="overflow-hidden cursor-pointer group">
                <div className="relative aspect-[9/16] overflow-hidden">
                  <img
                    src={reel.thumbnail}
                    alt={reel.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-12 w-12 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6 ring-2 ring-white">
                        <AvatarImage src={reel.author.avatar} />
                        <AvatarFallback>{reel.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-white truncate">{reel.author.name}</span>
                    </div>
                    <p className="text-xs text-white/90 truncate">{reel.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-white/80 flex items-center gap-0.5">
                        <Eye className="h-3 w-3" /> {formatCount(reel.viewsCount)}
                      </span>
                      {reel.earnedSEP > 0 && (
                        <Badge className="bg-primary/80 border-0 text-primary-foreground text-[9px] px-1.5 py-0">
                          +{reel.earnedSEP} SEP
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Long-form Videos */}
        <div>
          <h2 className="font-semibold text-foreground mb-3">Videos For You</h2>
          <div className="space-y-3">
            {videoPosts.slice(0, 4).map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={post.image || post.images?.[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                      <Play className="h-7 w-7 text-white fill-white" />
                    </div>
                  </div>
                  {post.viewsCount && (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white rounded px-2 py-0.5 text-xs flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {formatCount(post.viewsCount)}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">{post.createdAt}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {post.totalReactions}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {post.commentsCount}</span>
                    <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> {post.sharesCount}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Watch;
