import { Play, Eye, Heart, MessageCircle, Coins } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Reel } from "@/lib/mock-data";
import { Link } from "react-router-dom";

interface ReelInterstitialProps {
  reel: Reel;
}

const formatCount = (n: number) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n);

const ReelInterstitial = ({ reel }: ReelInterstitialProps) => {
  return (
    <Card className="overflow-hidden rounded-none sm:rounded-xl border-x-0 sm:border-x">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Reels</span>
        </div>
        <Link to="/reels" className="text-xs text-primary font-medium hover:underline">See All</Link>
      </div>
      <Link to="/reels" className="block">
        <div className="relative aspect-[9/14] max-h-[500px] overflow-hidden bg-muted cursor-pointer group">
          <img
            src={reel.thumbnail}
            alt={reel.description}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Play className="h-7 w-7 text-white fill-white" />
            </div>
          </div>

          {/* View count */}
          <div className="absolute bottom-14 left-3 flex items-center gap-1 text-white text-sm">
            <Eye className="h-4 w-4" />
            <span className="font-semibold">{formatCount(reel.viewsCount)}</span>
          </div>

          {/* Right side actions */}
          <div className="absolute bottom-14 right-3 flex flex-col gap-3 items-center">
            <div className="flex flex-col items-center text-white">
              <Heart className="h-6 w-6" />
              <span className="text-xs font-medium">{formatCount(reel.likesCount)}</span>
            </div>
            <div className="flex flex-col items-center text-white">
              <MessageCircle className="h-6 w-6" />
              <span className="text-xs font-medium">{formatCount(reel.commentsCount)}</span>
            </div>
          </div>

          {/* Author */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2">
            <Avatar className="h-8 w-8 ring-2 ring-white">
              <AvatarImage src={reel.author.avatar} />
              <AvatarFallback>{reel.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{reel.author.name}</p>
              <p className="text-xs text-white/80 truncate">{reel.description}</p>
            </div>
            {reel.earnedSEP > 0 && (
              <Badge className="bg-primary/80 border-0 text-primary-foreground gap-1 text-[10px]">
                <Coins className="h-3 w-3" />+{reel.earnedSEP}
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ReelInterstitial;
