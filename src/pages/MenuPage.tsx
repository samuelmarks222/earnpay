import { Link } from "react-router-dom";
import {
  MessageCircle, Users, Film, Store, Flag, Bookmark, Clock, Gift, Calendar,
  ShieldCheck, Rss, ChevronLeft, Search, SlidersHorizontal, Coins, Wallet
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser, earningStats } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";

const menuItems = [
  { icon: MessageCircle, label: "Messages", path: "/messages", color: "text-purple-500", bg: "bg-purple-100" },
  { icon: Users, label: "Groups", path: "/groups", color: "text-blue-500", bg: "bg-blue-100" },
  { icon: Users, label: "Friends", path: "/friends", color: "text-teal-500", bg: "bg-teal-100" },
  { icon: Film, label: "Reels", path: "/reels", color: "text-red-500", bg: "bg-red-100" },
  { icon: Store, label: "Marketplace", path: "/marketplace", color: "text-cyan-600", bg: "bg-cyan-100" },
  { icon: Flag, label: "Pages", path: "/pages", color: "text-orange-500", bg: "bg-orange-100" },
  { icon: Bookmark, label: "Saved", path: "/saved", color: "text-violet-500", bg: "bg-violet-100" },
  { icon: Clock, label: "Memories", path: "/memories", color: "text-sky-500", bg: "bg-sky-100" },
  { icon: Gift, label: "Birthdays", path: "/birthdays", color: "text-pink-500", bg: "bg-pink-100" },
  { icon: Calendar, label: "Events", path: "/events", color: "text-red-400", bg: "bg-red-50" },
  { icon: ShieldCheck, label: "Verified", path: "/verified", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Rss, label: "Feeds", path: "/feeds", color: "text-orange-500", bg: "bg-orange-50" },
  { icon: Wallet, label: "Earnings", path: "/earnings", color: "text-primary", bg: "bg-primary/10" },
];

const MenuPage = () => {
  return (
    <MainLayout>
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Menu</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-secondary h-9 w-9">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full bg-secondary h-9 w-9">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Link */}
        <Link to="/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">View your profile</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Earnings card */}
        <Card className="overflow-hidden">
          <div className="gradient-earn p-4 flex items-center gap-3">
            <Coins className="h-6 w-6 text-earn-foreground" />
            <div>
              <p className="text-xs text-earn-foreground/80">Available Balance</p>
              <p className="font-display text-xl font-bold text-earn-foreground">{earningStats.availableBalance.toFixed(2)} SEP</p>
            </div>
            <Link to="/earnings" className="ml-auto">
              <Button size="sm" variant="secondary" className="text-xs">View Earnings</Button>
            </Link>
          </div>
        </Card>

        {/* Invite friends */}
        <Card>
          <CardContent className="p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-lg">❤️</span>
            </div>
            <span className="font-medium text-sm text-foreground">Invite friends</span>
          </CardContent>
        </Card>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-2">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.path}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-3">
                  <div className={`h-8 w-8 rounded-lg ${item.bg} flex items-center justify-center mb-1.5`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <p className="font-medium text-sm text-foreground">{item.label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default MenuPage;
