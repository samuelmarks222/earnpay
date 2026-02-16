import { useState } from "react";
import { Search, UserPlus, UserCheck, MessageCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users, currentUser, friendRequests } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const Friends = () => {
  const friends = users.filter((u) => u.id !== currentUser.id);
  const [requests, setRequests] = useState(friendRequests);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-xl font-bold text-foreground">Friends</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search friends..." className="pl-9 bg-secondary border-0 rounded-full" />
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="requests" className="flex-1">Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">All Friends</TabsTrigger>
            <TabsTrigger value="suggestions" className="flex-1">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-4 space-y-3">
            {requests.map((req, i) => (
              <motion.div key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={req.user.avatar} />
                      <AvatarFallback>{req.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{req.user.name}</p>
                      <p className="text-xs text-muted-foreground">{req.mutualFriends} mutual friends · {req.timeAgo}</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="bg-primary text-primary-foreground text-xs" onClick={() => setRequests(prev => prev.filter(r => r.id !== req.id))}>
                          Confirm
                        </Button>
                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => setRequests(prev => prev.filter(r => r.id !== req.id))}>
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="all" className="mt-4 space-y-2">
            {friends.map((user, i) => (
              <motion.div key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <Card>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      {user.isOnline && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.friendsCount} friends</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4 grid grid-cols-2 gap-3">
            {friends.slice(0, 4).map((user, i) => (
              <motion.div key={user.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden">
                  <img src={user.avatar} alt={user.name} className="w-full h-40 object-cover" />
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground">3 mutual friends</p>
                    <Button size="sm" className="w-full mt-2 gap-1 text-xs">
                      <UserPlus className="h-3 w-3" /> Add Friend
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
