import { useState } from "react";
import { MessageCircle, Share2, MoreHorizontal, X, Coins, Globe, Users, ThumbsUp, Eye } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import PostComments from "./PostComments";
import DecoratedText from "./DecoratedText";

const reactionEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡"];

interface PostCardProps {
  post: any;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useAuth();
  const [showReactions, setShowReactions] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [localReactions, setLocalReactions] = useState(post.reactions_count || 0);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const authorName = post.profiles?.full_name || post.author?.name || "User";
  const authorAvatar = post.profiles?.avatar_url || post.author?.avatar || "";
  const authorInitials = authorName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const content = post.content || "";
  const createdAt = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : post.createdAt || "";
  const privacy = post.privacy || "public";
  const isSponsored = post.is_sponsored || false;
  const sponsorName = post.sponsor_name || "";
  const earnedSEP = post.sep_earned || post.earnedSEP || 0;
  const commentsCount = post.comments_count || post.commentsCount || 0;
  const sharesCount = post.shares_count || post.sharesCount || 0;
  const viewsCount = post.views_count || post.viewsCount || 0;
  const mediaUrls = post.media_urls || post.images || (post.image ? [post.image] : []);

  const handleReaction = async (emoji: string) => {
    if (selectedReaction === emoji) {
      setSelectedReaction(null);
      setLocalReactions((prev: number) => prev - 1);
      if (user) {
        await supabase.from('reactions').delete().eq('post_id', post.id).eq('user_id', user.id);
      }
    } else {
      if (!selectedReaction) setLocalReactions((prev: number) => prev + 1);
      setSelectedReaction(emoji);
      if (user) {
        await supabase.from('reactions').upsert({
          post_id: post.id,
          user_id: user.id,
          reaction_type: emoji,
        }, { onConflict: 'user_id,post_id' });
      }
    }
    setShowReactions(false);
  };

  const shouldTruncate = content.length > 200;
  const displayContent = shouldTruncate && !showMore ? content.slice(0, 200) + "..." : content;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden rounded-none sm:rounded-xl border-x-0 sm:border-x">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-start justify-between p-3 pb-1">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                <AvatarImage src={authorAvatar} alt={authorName} />
                <AvatarFallback>{authorInitials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold text-foreground">
                    {isSponsored ? sponsorName : authorName}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isSponsored ? (
                    <span>Sponsored</span>
                  ) : (
                    <>
                      <span>{createdAt}</span>
                      <span>·</span>
                      {privacy === "public" ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {earnedSEP > 0 && (
                <Badge variant="secondary" className="gap-1 text-[10px] bg-primary/10 text-primary border-0 hidden sm:flex">
                  <Coins className="h-3 w-3" />+{earnedSEP} SEP
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

          {/* Content with decorations */}
          {content && (
            <div className="px-3 pb-2">
              <p className="text-sm leading-relaxed">
                <DecoratedText text={displayContent} />
                {shouldTruncate && !showMore && (
                  <button className="text-muted-foreground font-medium ml-1" onClick={() => setShowMore(true)}>see more</button>
                )}
              </p>
            </div>
          )}

          {/* Images Grid */}
          {mediaUrls.length > 0 && (
            <div className={`relative ${mediaUrls.length === 1 ? "" : "grid gap-0.5"} ${
              mediaUrls.length === 2 ? "grid-cols-2" : mediaUrls.length >= 3 ? "grid-cols-2" : ""
            }`}>
              {mediaUrls.slice(0, 4).map((img: string, i: number) => (
                <div
                  key={i}
                  className={`relative overflow-hidden cursor-pointer ${
                    mediaUrls.length === 3 && i === 0 ? "row-span-2" : ""
                  } ${mediaUrls.length === 1 ? "max-h-[500px]" : "aspect-square"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover hover:brightness-95 transition-all" />
                  {mediaUrls.length > 4 && i === 3 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">+{mediaUrls.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
              {viewsCount > 0 && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 text-white rounded-full px-2 py-0.5 text-xs">
                  <Eye className="h-3 w-3" />
                  {viewsCount >= 1000 ? `${(viewsCount / 1000).toFixed(0)}K` : viewsCount}
                </div>
              )}
            </div>
          )}

          {/* Reaction Summary */}
          <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>👍</span>
              <span className="ml-1">{localReactions.toLocaleString()}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowComments(!showComments)} className="hover:underline">
                {commentsCount} comments
              </button>
              <span>{sharesCount} shares</span>
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

            <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs text-muted-foreground" onClick={() => setShowComments(!showComments)}>
              <MessageCircle className="h-4 w-4" /> Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-1.5 text-xs text-muted-foreground">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="border-t">
              <PostComments postId={post.id} commentsCount={commentsCount} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
