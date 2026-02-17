import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, MessageCircle, X, ChevronDown, ExternalLink } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/lib/mock-data";

const sponsoredAds = [
  {
    id: "ad1",
    title: "Premium Craft Spirits",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=200&fit=crop",
    link: "premiumspirits.com",
    description: "Toast to a refined celebration with premium craft spirits.",
  },
  {
    id: "ad2",
    title: "Learn Design Online",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop",
    link: "designacademy.io",
    description: "Master UI/UX design with expert-led courses.",
  },
];

const friendSuggestions = users.slice(3, 7).map((u) => ({
  ...u,
  mutualFriends: Math.floor(Math.random() * 15) + 1,
}));

const onlineFriends = users.filter((u) => u.isOnline && u.id !== "1");

const RightSidebar = () => {
  const [chatOpen, setChatOpen] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [dismissed, setDismissed] = useState<string[]>([]);

  return (
    <div className="sticky top-[110px]">
      <ScrollArea className="h-[calc(100vh-120px)] pr-1">
          <div className="space-y-4">
            {/* Sponsored Ads */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">Sponsored</p>
              {sponsoredAds.map((ad) => (
                <div key={ad.id} className="flex gap-3 mb-3 cursor-pointer hover:bg-secondary/50 rounded-lg p-1.5 transition-colors">
                  <img src={ad.image} alt={ad.title} className="h-[80px] w-[80px] rounded-lg object-cover shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{ad.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{ad.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{ad.link}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t" />

            {/* Friend Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-semibold text-muted-foreground">People You May Know</p>
                <Link to="/friends" className="text-xs text-primary hover:underline">See All</Link>
              </div>
              {friendSuggestions
                .filter((s) => !dismissed.includes(s.id))
                .slice(0, 3)
                .map((user) => (
                  <div key={user.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.mutualFriends} mutual friends</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setDismissed((d) => [...d, user.id])}>
                        <X className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="border-t" />

            {/* Online Friends & Chat */}
            <div>
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-xs font-semibold text-muted-foreground">Contacts</p>
                <Link to="/messages" className="text-xs text-primary hover:underline">
                  <MessageCircle className="h-3.5 w-3.5" />
                </Link>
              </div>
              {onlineFriends.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setChatOpen(chatOpen === user.id ? null : user.id)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />
                  </div>
                  <span className="text-sm text-foreground">{user.name}</span>
                </div>
              ))}

              {/* Mini Chat Box */}
              {chatOpen && (
                <Card className="mt-2 overflow-hidden">
                  <div className="flex items-center justify-between p-2 border-b bg-secondary/30">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={onlineFriends.find((u) => u.id === chatOpen)?.avatar} />
                      </Avatar>
                      <span className="text-xs font-semibold text-foreground">
                        {onlineFriends.find((u) => u.id === chatOpen)?.name}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setChatOpen(null)}>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setChatOpen(null)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-2">
                    <div className="h-[120px] flex items-center justify-center text-xs text-muted-foreground">
                      Start a conversation
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      <Input
                        value={chatMsg}
                        onChange={(e) => setChatMsg(e.target.value)}
                        placeholder="Aa"
                        className="h-7 text-xs bg-secondary border-0 rounded-full"
                      />
                      <Button size="icon" className="h-7 w-7 shrink-0 bg-primary rounded-full" disabled={!chatMsg.trim()}>
                        <MessageCircle className="h-3 w-3 text-primary-foreground" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
      </ScrollArea>
    </div>
  );
};

export default RightSidebar;
