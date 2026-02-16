import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users, ShoppingBag, Megaphone, CalendarDays, MonitorPlay, Pin, Wallet,
  Bookmark, ChevronDown, ChevronUp, UserCircle, Newspaper, Flag, Settings, HelpCircle
} from "lucide-react";
import { currentUser, groups, earningStats } from "@/lib/mock-data";
import { useState } from "react";

const mainNav = [
  { icon: UserCircle, label: currentUser.name, path: "/profile", avatar: currentUser.avatar },
  { icon: Wallet, label: "Earnings Hub", path: "/earnings", badge: `+${earningStats.todayEarnings} SEP`, badgeColor: "bg-primary text-primary-foreground" },
  { icon: Newspaper, label: "News Feed", path: "/" },
  { icon: Users, label: "Friends", path: "/friends" },
  { icon: Flag, label: "Pages", path: "/pages" },
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: MonitorPlay, label: "Watch", path: "/watch" },
  { icon: CalendarDays, label: "Events", path: "/events" },
  { icon: Megaphone, label: "Advertising", path: "/advertising" },
  { icon: Bookmark, label: "Saved", path: "/saved" },
];

const LeftSidebar = () => {
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  const pinnedGroups = groups.filter((g) => g.isPinned);
  const joinedGroups = groups.filter((g) => g.isJoined);

  const visibleNav = showMore ? mainNav : mainNav.slice(0, 7);

  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-[100px]">
        <ScrollArea className="h-[calc(100vh-110px)] pr-2">
          <nav className="space-y-0.5 pb-2">
            {visibleNav.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path + item.label}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary ${
                    active ? "bg-secondary font-semibold text-foreground" : "text-foreground"
                  }`}
                >
                  {item.avatar ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback>{item.label[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  )}
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className={`text-[10px] px-1.5 py-0 h-5 border-0 ${item.badgeColor || "bg-destructive text-destructive-foreground"}`}>
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-secondary w-full transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                {showMore ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              <span>{showMore ? "See less" : "See more"}</span>
            </button>
          </nav>

          {/* Pinned Groups */}
          {pinnedGroups.length > 0 && (
            <div className="border-t pt-3 mt-2">
              <div className="flex items-center gap-2 px-2 mb-2">
                <Pin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Pinned Groups</span>
              </div>
              {pinnedGroups.map((group) => (
                <Link
                  key={group.id}
                  to="/groups"
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary transition-colors"
                >
                  <img src={group.cover} alt={group.name} className="h-8 w-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{group.name}</p>
                    <p className="text-[11px] text-muted-foreground">{group.lastActive}</p>
                  </div>
                  {group.postsToday > 0 && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Group Shortcuts */}
          <div className="border-t pt-3 mt-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Shortcuts</span>
              <Link to="/groups" className="text-xs text-primary hover:underline">See All</Link>
            </div>
            {joinedGroups.slice(0, 4).map((group) => (
              <Link
                key={group.id}
                to="/groups"
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary transition-colors"
              >
                <img src={group.cover} alt={group.name} className="h-8 w-8 rounded-lg object-cover" />
                <span className="flex-1 truncate text-foreground">{group.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-4 pb-6 px-2">
            <p className="text-[11px] text-muted-foreground">
              Privacy · Terms · Advertising · Cookies · © 2026 SocialEarn
            </p>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default LeftSidebar;
