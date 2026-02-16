import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Store, MessageCircle, Bell, Search, Wallet, Menu, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { currentUser, earningStats } from "@/lib/mock-data";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: Store, label: "Marketplace", path: "/marketplace" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="gradient-earn flex h-8 w-8 items-center justify-center rounded-lg">
            <span className="font-display text-sm font-bold text-primary-foreground">SE</span>
          </div>
          <span className="font-display text-lg font-bold text-foreground hidden sm:block">
            Social<span className="text-primary">Earn</span>
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search SocialEarn..."
              className="pl-9 bg-secondary border-0 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative px-6 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <item.icon className="h-5 w-5" />
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-[13px] left-2 right-2 h-[3px] rounded-t-full gradient-earn"
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Earnings Pill */}
          <Link to="/earnings">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden sm:flex items-center gap-1.5 rounded-full gradient-earn px-3 py-1.5 glow-earn cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5 text-earn-foreground" />
              <span className="text-xs font-bold text-earn-foreground">
                {earningStats.todayEarnings.toFixed(1)} SEP
              </span>
            </motion.div>
          </Link>

          <Button variant="ghost" size="icon" className="relative text-muted-foreground">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] gradient-earn border-0 text-earn-foreground">
              3
            </Badge>
          </Button>

          <Link to="/profile">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20 cursor-pointer hover:ring-primary/50 transition-all">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t overflow-hidden"
          >
            <nav className="flex flex-col p-2 gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              ))}
              <Link to="/earnings" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-3">
                  <Wallet className="h-5 w-5" />
                  Earnings Hub
                </Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
