import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, MessageCircle, MonitorPlay, Bell, Menu, Search, Plus, Wallet } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { currentUser, earningStats } from "@/lib/mock-data";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/", badge: "15+" },
  { icon: Users, label: "Friends", path: "/friends", badge: "" },
  { icon: MessageCircle, label: "Messages", path: "/messages", badge: "" },
  { icon: MonitorPlay, label: "Video", path: "/reels", badge: "15+" },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: "3" },
  { icon: Menu, label: "Menu", path: "/menu", badge: "" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-xl">
      {/* Top bar */}
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between gap-3 px-4">
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <span className="font-display text-xl font-bold text-primary">
            Social<span className="text-foreground">Earn</span>
          </span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search SocialEarn..."
              className="pl-9 bg-secondary border-0 rounded-full h-9 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="rounded-full bg-secondary h-9 w-9 md:hidden">
            <Search className="h-4 w-4 text-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full bg-secondary h-9 w-9">
            <Plus className="h-5 w-5 text-foreground" />
          </Button>

          {/* Earnings Pill */}
          <Link to="/earnings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-1.5 rounded-full gradient-earn px-2.5 py-1 glow-earn cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5 text-earn-foreground" />
              <span className="text-xs font-bold text-earn-foreground">
                {earningStats.todayEarnings.toFixed(1)} SEP
              </span>
            </motion.div>
          </Link>

          <Link to="/profile">
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="mx-auto max-w-7xl flex items-center justify-around border-t">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <div
                className={`relative flex items-center justify-center py-2 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className="relative">
                  <item.icon className="h-5 w-5" />
                  {item.badge && (
                    <Badge className="absolute -top-2 -right-3 h-4 min-w-[16px] p-0 flex items-center justify-center text-[9px] bg-destructive border-0 text-destructive-foreground">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                {active && (
                  <motion.div
                    layoutId="nav-tab"
                    className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary rounded-t-full"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
