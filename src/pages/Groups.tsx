import { useState } from "react";
import { Search, Plus, Users, TrendingUp, Coins } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { groups } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const Groups = () => {
  const [joinedGroups, setJoinedGroups] = useState(
    groups.reduce((acc, g) => ({ ...acc, [g.id]: g.isJoined }), {} as Record<string, boolean>)
  );

  const toggleJoin = (id: string) => {
    setJoinedGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const myGroups = groups.filter((g) => joinedGroups[g.id]);
  const discoverGroups = groups.filter((g) => !joinedGroups[g.id]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Groups</h1>
          <Button size="sm" className="gradient-earn text-earn-foreground gap-1.5">
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search groups..." className="pl-9 bg-secondary border-0 rounded-full" />
        </div>

        <Tabs defaultValue="your-groups">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="your-groups" className="flex-1">Your Groups</TabsTrigger>
            <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="your-groups" className="mt-4 space-y-3">
            {myGroups.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Join some groups to see them here!</CardContent></Card>
            ) : (
              myGroups.map((group, i) => (
                <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex">
                      <img src={group.cover} alt={group.name} className="w-24 h-24 object-cover shrink-0" />
                      <CardContent className="p-3 flex-1">
                        <h3 className="font-semibold text-sm text-foreground">{group.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{group.description}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{group.membersCount.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{group.postsToday} today</span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="discover" className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discoverGroups.map((group, i) => (
              <motion.div key={group.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden">
                  <img src={group.cover} alt={group.name} className="w-full h-32 object-cover" />
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm text-foreground">{group.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{group.membersCount.toLocaleString()} members</p>
                    <p className="text-xs text-muted-foreground">{group.description}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={() => toggleJoin(group.id)}>
                        Join Group
                      </Button>
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Coins className="h-3 w-3" />+5 SEP
                      </Badge>
                    </div>
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

export default Groups;
