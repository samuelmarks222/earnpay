import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users, ShoppingBag, Megaphone, CalendarDays, MonitorPlay, Bookmark,
  ChevronDown, ChevronUp, Newspaper, Clock, Wallet, BarChart3
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";

interface SidebarGroup {
  id: string;
  name: string;
  avatar_url: string | null;
}

const LeftSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [showMore, setShowMore] = useState(false);
  const [groups, setGroups] = useState<SidebarGroup[]>([]);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "";

  useEffect(() => {
    if (!user) return;
    const fetchGroups = async () => {
      const { data: memberships } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id)
        .limit(5);
      if (memberships && memberships.length > 0) {
        const groupIds = memberships.map(m => m.group_id);
        const { data } = await supabase
          .from("groups")
          .select("id, name, avatar_url")
          .in("id", groupIds);
        setGroups((data || []) as SidebarGroup[]);
      }
    };
    fetchGroups();
  }, [user]);

  const mainNav = [
    { icon: null, label: displayName, path: "/profile", avatar: avatarUrl },
    { icon: Users, label: "Friends", path: "/friends" },
    { icon: Clock, label: "Memories", path: "/saved" },
    { icon: Bookmark, label: "Saved", path: "/saved" },
    { icon: Users, label: "Groups", path: "/groups" },
    { icon: MonitorPlay, label: "Reels", path: "/reels" },
    { icon: ShoppingBag, label: "Marketplace", path: "/marketplace" },
    { icon: Newspaper, label: "Feeds", path: "/" },
    { icon: CalendarDays, label: "Events", path: "/events" },
    { icon: Megaphone, label: "Ads Manager", path: "/advertising" },
    { icon: Wallet, label: "Earnings Hub", path: "/earnings" },
  ];

  const visibleNav = showMore ? mainNav : mainNav.slice(0, 7);

  return (
    <aside className="hidden lg:block w-[280px] shrink-0">
      <div className="sticky top-[100px]">
        <ScrollArea className="h-[calc(100vh-110px)] pr-2">
          <nav className="space-y-0.5 pb-2">
            {visibleNav.map((item, idx) => {
              const active = location.pathname === item.path && idx !== 0;
              return (
                <Link
                  key={item.path + item.label + idx}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-secondary ${
                    active ? "bg-secondary font-semibold text-foreground" : "text-foreground"
                  }`}
                >
                  {item.avatar !== undefined ? (
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={item.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">{item.label[0]}</AvatarFallback>
                    </Avatar>
                  ) : item.icon ? (
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  ) : null}
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}

            <button
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-secondary w-full transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary">
                {showMore ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
              <span>{showMore ? "See less" : "See more"}</span>
            </button>
          </nav>

          {/* Your Shortcuts (Groups) */}
          {groups.length > 0 && (
            <div className="border-t pt-3 mt-2">
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Shortcuts</span>
                <Link to="/groups" className="text-xs text-primary hover:underline">See All</Link>
              </div>
              {groups.map((group) => (
                <Link
                  key={group.id}
                  to="/groups"
                  className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary transition-colors"
                >
                  <Avatar className="h-9 w-9 rounded-lg">
                    <AvatarImage src={group.avatar_url || ""} className="rounded-lg" />
                    <AvatarFallback className="rounded-lg bg-secondary text-muted-foreground text-xs">{group.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 truncate text-foreground">{group.name}</span>
                </Link>
              ))}
            </div>
          )}

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
