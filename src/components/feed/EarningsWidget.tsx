import { Link } from "react-router-dom";
import { Wallet, TrendingUp, Flame, ArrowRight, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { earningStats, currentUser } from "@/lib/mock-data";
import { motion } from "framer-motion";

const EarningsWidget = () => {
  const dailyGoal = 50;
  const dailyProgress = (earningStats.todayEarnings / dailyGoal) * 100;

  return (
    <div className="space-y-4">
      {/* Earnings Summary */}
      <Card className="overflow-hidden">
        <div className="gradient-earn p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="h-5 w-5 text-earn-foreground" />
            <h3 className="font-display font-bold text-earn-foreground text-sm">Earnings Hub</h3>
          </div>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-3xl font-bold text-earn-foreground"
          >
            {earningStats.availableBalance.toFixed(2)}
            <span className="text-sm font-normal ml-1 opacity-80">SEP</span>
          </motion.p>
          <p className="text-xs text-earn-foreground/70 mt-1">Available balance</p>
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Today's earnings</span>
            <span className="font-semibold text-primary">+{earningStats.todayEarnings} SEP</span>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Daily goal</span>
              <span className="text-muted-foreground">{earningStats.todayEarnings}/{dailyGoal} SEP</span>
            </div>
            <Progress value={dailyProgress} className="h-2" />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Pending</span>
            <span className="text-accent-foreground">{earningStats.pendingBalance} SEP</span>
          </div>
          <Link to="/earnings">
            <Button variant="outline" size="sm" className="w-full mt-1 gap-2 text-xs">
              View Full Dashboard <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-gold glow-gold">
              <Flame className="h-5 w-5 text-gold-foreground" />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-foreground">{earningStats.loginStreak} days</p>
              <p className="text-xs text-muted-foreground">Login streak 🔥</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Post */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-xs font-semibold text-foreground">Top Performing Post</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-primary" />
            <span className="font-display font-bold text-primary">{earningStats.topPostEarnings} SEP</span>
            <span className="text-xs text-muted-foreground">earned</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <p className="text-xs font-semibold text-foreground mb-2">Quick Links</p>
          {[
            { label: "Friends", count: currentUser.friendsCount },
            { label: "Followers", count: currentUser.followersCount },
            { label: "Groups", count: 12 },
            { label: "Saved Posts", count: 34 },
          ].map((item) => (
            <div key={item.label} className="flex justify-between text-xs py-1">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium text-foreground">{item.count.toLocaleString()}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsWidget;
