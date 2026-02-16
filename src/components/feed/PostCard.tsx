import { useState } from "react";
import { MessageCircle, Share2, Bookmark, MoreHorizontal, TrendingUp, Coins } from "lucide-react";
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{post.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {post.earnedSEP > 0 && (
                <Badge variant="secondary" className="gap-1 text-xs bg-primary/10 text-primary border-0">
                  <Coins className="h-3 w-3" />
                  +{post.earnedSEP} SEP
                </Badge>
              )}
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>

          {/* Image */}
          {post.image && (
            <div className="relative">
              <img src={post.image} alt="" className="w-full object-cover max-h-96" />
              {post.earnedSEP >= 50 && (
                <div className="absolute top-3 right-3">
                  <Badge className="gradient-gold text-gold-foreground gap-1 glow-gold border-0">
                    <TrendingUp className="h-3 w-3" /> Viral Bonus
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Reaction Summary */}
          <div className="flex items-center justify-between px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              {post.reactions.slice(0, 3).map((r) => (
                <span key={r.type} className="text-sm">{r.type}</span>
              ))}
              <span className="ml-1">{localReactions}</span>
            </div>
            <div className="flex gap-3">
              <span>{post.commentsCount} comments</span>
              <span>{post.sharesCount} shares</span>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t mx-4" />
          <div className="flex items-center px-2 py-1 relative">
            <div
              className="relative flex-1"
              onMouseEnter={() => setShowReactions(true)}
              onMouseLeave={() => setShowReactions(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`w-full gap-2 text-xs ${selectedReaction ? "text-primary" : "text-muted-foreground"}`}
                onClick={() => handleReaction("👍")}
              >
                <span className="text-base">{selectedReaction || "👍"}</span>
                {selectedReaction ? "Reacted" : "React"}
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

            <Button variant="ghost" size="sm" className="flex-1 gap-2 text-xs text-muted-foreground">
              <MessageCircle className="h-4 w-4" /> Comment
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-2 text-xs text-muted-foreground">
              <Share2 className="h-4 w-4" /> Share
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PostCard;
