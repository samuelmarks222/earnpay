import { useState } from "react";
import { Play, Heart, MessageCircle, Share2, Coins, Eye, Volume2, VolumeX } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { reels } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const Reels = () => {
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedReels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-xl font-bold text-foreground">Reels & Videos</h1>
          <Badge className="gradient-earn text-earn-foreground border-0 gap-1 text-xs">
            <Coins className="h-3 w-3" /> Earn up to 50 SEP per reel!
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {reels.map((reel, i) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[9/16]"
            >
              <img
                src={reel.thumbnail}
                alt={reel.description}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-6 w-6 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Earnings badge */}
              {reel.earnedSEP > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="gradient-earn text-earn-foreground border-0 gap-0.5 text-[10px]">
                    <Coins className="h-2.5 w-2.5" />+{reel.earnedSEP}
                  </Badge>
                </div>
              )}

              {/* Bottom info */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-7 w-7 border border-white/50">
                    <AvatarImage src={reel.author.avatar} />
                    <AvatarFallback className="text-[10px]">{reel.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-semibold text-white truncate">{reel.author.name}</span>
                </div>
                <p className="text-xs text-white/90 truncate">{reel.description}</p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/70">
                  <span className="flex items-center gap-0.5">
                    <Eye className="h-3 w-3" />
                    {reel.viewsCount >= 1000 ? `${(reel.viewsCount / 1000).toFixed(0)}K` : reel.viewsCount}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <Heart className={`h-3 w-3 ${likedReels[reel.id] ? "fill-destructive text-destructive" : ""}`} />
                    {reel.likesCount >= 1000 ? `${(reel.likesCount / 1000).toFixed(1)}K` : reel.likesCount}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MessageCircle className="h-3 w-3" />
                    {reel.commentsCount}
                  </span>
                </div>
              </div>

              {/* Side actions */}
              <div className="absolute right-2 bottom-20 flex flex-col gap-3">
                <button onClick={() => toggleLike(reel.id)} className="flex flex-col items-center">
                  <Heart className={`h-5 w-5 ${likedReels[reel.id] ? "fill-destructive text-destructive" : "text-white"}`} />
                </button>
                <button className="flex flex-col items-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </button>
                <button className="flex flex-col items-center">
                  <Share2 className="h-5 w-5 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Reels;
