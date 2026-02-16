import { Bell, Heart, MessageCircle, UserPlus, Coins, TrendingUp, Share2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { users } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const notifications = [
  { id: "n1", type: "reaction", user: users[1], text: "reacted ❤️ to your post", time: "2m ago", read: false, sep: 2 },
  { id: "n2", type: "comment", user: users[3], text: "commented on your post: \"This is amazing!\"", time: "15m ago", read: false, sep: 5 },
  { id: "n3", type: "friend", user: users[6], text: "sent you a friend request", time: "1h ago", read: false, sep: 0 },
  { id: "n4", type: "earning", user: users[0], text: "You earned 45.5 SEP from your viral post! 🎉", time: "2h ago", read: false, sep: 45.5 },
  { id: "n5", type: "share", user: users[2], text: "shared your post", time: "3h ago", read: true, sep: 3 },
  { id: "n6", type: "reaction", user: users[4], text: "and 23 others reacted to your post", time: "5h ago", read: true, sep: 8 },
  { id: "n7", type: "earning", user: users[0], text: "Login streak bonus! 🔥 +10 SEP for 14-day streak", time: "8h ago", read: true, sep: 10 },
  { id: "n8", type: "comment", user: users[5], text: "replied to your comment", time: "1d ago", read: true, sep: 2 },
  { id: "n9", type: "friend", user: users[7], text: "accepted your friend request", time: "1d ago", read: true, sep: 0 },
  { id: "n10", type: "earning", user: users[0], text: "Weekly earning summary: 287 SEP earned! 📊", time: "2d ago", read: true, sep: 0 },
];

const getIcon = (type: string) => {
  switch (type) {
    case "reaction": return <Heart className="h-4 w-4 text-destructive" />;
    case "comment": return <MessageCircle className="h-4 w-4 text-primary" />;
    case "friend": return <UserPlus className="h-4 w-4 text-blue-500" />;
    case "earning": return <Coins className="h-4 w-4 text-accent" />;
    case "share": return <Share2 className="h-4 w-4 text-primary" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

const Notifications = () => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Notifications</h1>
          <button className="text-xs text-primary font-medium hover:underline">Mark all as read</button>
        </div>

        {notifications.map((notif, i) => (
          <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className={`${!notif.read ? "bg-primary/5 border-primary/20" : ""} hover:shadow-sm transition-shadow cursor-pointer`}>
              <CardContent className="p-3 flex items-start gap-3">
                <div className="relative shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={notif.user.avatar} />
                    <AvatarFallback>{notif.user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-card border flex items-center justify-center">
                    {getIcon(notif.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{notif.type === "earning" ? "" : notif.user.name + " "}</span>
                    {notif.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                    {notif.sep > 0 && (
                      <Badge variant="secondary" className="text-[10px] gap-0.5 bg-primary/10 text-primary border-0">
                        <Coins className="h-2.5 w-2.5" />+{notif.sep} SEP
                      </Badge>
                    )}
                  </div>
                </div>
                {!notif.read && <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0 mt-2" />}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Notifications;
