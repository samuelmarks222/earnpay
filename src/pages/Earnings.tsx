import { Wallet, TrendingUp, Clock, CheckCircle, Flame, ArrowUpRight, Gift, CreditCard, Coins, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { earningStats, weeklyEarnings } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const chartConfig = {
  posts: { label: "Posts", color: "hsl(158 64% 40%)" },
  engagement: { label: "Engagement", color: "hsl(155 70% 50%)" },
  ads: { label: "Ad Views", color: "hsl(45 93% 58%)" },
  streaks: { label: "Streaks", color: "hsl(160 30% 70%)" },
};

const statCards = [
  {
    label: "Today's Earnings",
    value: earningStats.todayEarnings,
    icon: TrendingUp,
    color: "text-primary",
    bgClass: "bg-primary/10",
  },
  {
    label: "Available Balance",
    value: earningStats.availableBalance,
    icon: Wallet,
    color: "text-primary",
    bgClass: "gradient-earn",
    highlight: true,
  },
  {
    label: "Pending",
    value: earningStats.pendingBalance,
    icon: Clock,
    color: "text-accent-foreground",
    bgClass: "bg-accent/20",
  },
  {
    label: "Lifetime Earned",
    value: earningStats.lifetimeEarnings,
    icon: CheckCircle,
    color: "text-primary",
    bgClass: "bg-primary/10",
  },
];

const redeemOptions = [
  { label: "PayPal Cash", description: "Instant payout", icon: CreditCard, minAmount: 10 },
  { label: "Gift Cards", description: "Amazon, Starbucks & more", icon: Gift, minAmount: 5 },
  { label: "Boost Posts", description: "Increase your reach", icon: ArrowUpRight, minAmount: 2 },
  { label: "Ad-Free Month", description: "Remove all ads", icon: CheckCircle, minAmount: 50 },
];

const Earnings = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Earnings Hub</h1>
            <p className="text-sm text-muted-foreground">Track your earnings and redeem rewards</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="gap-1 gradient-gold text-gold-foreground border-0 glow-gold">
              <Flame className="h-3 w-3" /> {earningStats.loginStreak}-day streak
            </Badge>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`overflow-hidden ${stat.highlight ? "glow-earn" : ""}`}>
                <CardContent className="p-4">
                  <div className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${stat.bgClass} mb-2`}>
                    <stat.icon className={`h-4 w-4 ${stat.highlight ? "text-earn-foreground" : stat.color}`} />
                  </div>
                  <p className="font-display text-xl font-bold text-foreground">
                    {stat.value.toFixed(2)}
                    <span className="text-xs font-normal text-muted-foreground ml-1">SEP</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Weekly Earnings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <BarChart data={weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="posts" stackId="a" fill="var(--color-posts)" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="engagement" stackId="a" fill="var(--color-engagement)" />
                  <Bar dataKey="ads" stackId="a" fill="var(--color-ads)" />
                  <Bar dataKey="streaks" stackId="a" fill="var(--color-streaks)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Redeem Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-base flex items-center gap-2">
                  <Coins className="h-4 w-4 text-primary" />
                  Redeem Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {redeemOptions.map((option) => (
                  <motion.div key={option.label} whileHover={{ x: 4 }}>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 h-auto py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <option.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        Min {option.minAmount} SEP
                      </Badge>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Earning breakdown */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="text-xs font-semibold text-foreground">This Week's Sources</p>
                {[
                  { label: "Content Creation", amount: 115, pct: 40, color: "bg-primary" },
                  { label: "Engagement", amount: 89, pct: 31, color: "bg-earn-glow" },
                  { label: "Ad Interaction", amount: 48, pct: 17, color: "bg-gold" },
                  { label: "Streaks & Bonuses", amount: 35, pct: 12, color: "bg-muted-foreground" },
                ].map((source) => (
                  <div key={source.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{source.label}</span>
                      <span className="font-medium">{source.amount} SEP</span>
                    </div>
                    <Progress value={source.pct} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Earnings;
