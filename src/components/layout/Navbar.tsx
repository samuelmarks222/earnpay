import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, MessageCircle, MonitorPlay, Bell, Menu, Search, Plus, Wallet, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { earningStats } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: Home, label: "Home", path: "/", badge: "" },
  { icon: Users, label: "Friends", path: "/friends", badge: "" },
  { icon: MessageCircle, label: "Messages", path: "/messages", badge: "" },
  { icon: MonitorPlay, label: "Video", path: "/reels", badge: "" },
  { icon: Bell, label: "Notifications", path: "/notifications", badge: "3" },
  { icon: Menu, label: "Menu", path: "/menu", badge: "" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = user?.user_metadata?.avatar_url || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

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
          {user && (
            <Link to="/earnings">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="hidden sm:flex items-center gap-1.5 rounded-full gradient-earn px-2.5 py-1 glow-earn cursor-pointer"
              >
                <Wallet className="h-3.5 w-3.5 text-primary-foreground" />
                <span className="text-xs font-bold text-primary-foreground">
                  {earningStats.todayEarnings.toFixed(1)} SEP
                </span>
              </motion.div>
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all">
                  <AvatarImage src={avatarUrl} alt={displayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="gap-2 cursor-pointer">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/earnings" className="gap-2 cursor-pointer">
                    <Wallet className="h-4 w-4" /> Earnings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive cursor-pointer">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button size="sm" className="gradient-earn text-primary-foreground h-8 px-3 text-xs">Sign In</Button>
            </Link>
          )}
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
