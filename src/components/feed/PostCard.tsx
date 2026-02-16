import { useState } from "react";
import { MessageCircle, Share2, Bookmark, MoreHorizontal, X, Coins, Globe, Users, ThumbsUp, Eye, Settings } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Post, reactionEmojis } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(post.totalReactions);
  const [showMore, setShowMore] = useState(false);

  const handleReaction = (emoji: string) => {
    if (selectedReaction === emoji) {
      setSelectedReaction(null);
      setLocalReactions((prev) => prev - 1);
    } else {
      if (!selectedReaction) setLocalReactions((prev) => prev + 1);
      setSelectedReaction(emoji);
    }
    setShowReactions(false);
  };

  const shouldTruncate = post.content.length > 200;
  const displayContent = shouldTruncate && !showMore ? post.content.slice(0, 200) + "..." : post.content;
  const allImages = post.images || (post.image ? [post.image] : []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-none sm:rounded-xl border-x-0 sm:border-x">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-start justify-between p-3 pb-1">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-foreground">
                    {post.isSponsored ? post.sponsorName : post.author.name}
                  </p>
                  {post.isFollowable && !post.isSponsored && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <button className="text-xs font-semibold text-primary hover:underline">Follow</button>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {post.isSponsored ? (
                    <>
                      <span>Sponsored</span>
                      <span>·</span>
                      <Settings className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span>{post.createdAt}</span>
                      <span>·</span>
                      {post.privacy === "public" ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {post.earnedSEP > 0 && (
                <Badge variant="secondary" className="gap-1 text-[10px] bg-primary/10 text-primary border-0 hidden sm:flex">
                  <Coins className="h-3 w-3" />+{post.earnedSEP} SEP
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-3 pb-2">
            <p className="text-sm leading-relaxed">
              {displayContent}
              {shouldTruncate && !showMore && (
                <button className="text-muted-foreground font-medium ml-1" onClick={() => setShowMore(true)}>see more</button>
              )}
            </p>
          </div>

          {/* Images Grid */}
          {allImages.length > 0 && (
            <div className={`relative ${allImages.length === 1 ? "" : "grid gap-0.5"} ${
              allImages.length === 2 ? "grid-cols-2" : allImages.length >= 3 ? "grid-cols-2" : ""
            }`}>
              {allImages.slice(0, 4).map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden cursor-pointer ${
                    allImages.length === 3 && i === 0 ? "row-span-2" : ""
                  } ${allImages.length === 1 ? "max-h-[500px]" : "aspect-square"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all" />
                  {allImages.length > 4 && i === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{allImages.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
              {post.viewsCount && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs">
                  <Eye className="h-3 w-3" />
                  {post.viewsCount >= 1000 ? `${(post.viewsCount / 1000).toFixed(0)}K` : post.viewsCount}
                </div>
              )}
            </div>
          )}

          {/* Reaction Summary */}
          <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {post.reactions.slice(0, 3).map((r) => (
                <span key={r.type} className="text-sm">{r.type}</span>
              ))}
              <span className="ml-1">{localReactions.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <span>{post.commentsCount} comments</span>
              <span>{post.sharesCount} shares</span>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t mx-3" />
          <div className="flex items-center px-1 py-0.5 relative">
            <div
              className="relative flex-1"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`w-full gap-1.5 text-xs ${selectedReaction ? "text-primary font-semibold" : "text-muted-foreground"}`}
                onClick={() => handleReaction("👍")}
              >
                {selectedReaction ? (
                  <span className="text-base">{selectedReaction}</span>
                ) : (
                  <ThumbsUp className="h-4 w-4" />
                )}
                {selectedReaction ? localReactions.toLocaleString() : "Like"}
              </Button>

              <AnimatePresence>
                {showReactions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute -top-12 left-0 flex gap-1 rounded-full bg-card border shadow-lg px-2 py-1.5 z-10"
                  >
                    {reactionEmojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        whileHover={{ scale: 1.3, y: -4 }}
                        onClick={() => handleReaction(emoji)}
                        className="text-xl px-0.5 cursor-pointer hover:drop-shadow-md transition-all"
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs text-muted-foreground">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
