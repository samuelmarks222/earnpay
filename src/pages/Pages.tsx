import { useState } from "react";
import { Search, Plus, ThumbsUp, Coins } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pages } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

const Pages = () => {
  const [likedPages, setLikedPages] = useState(
    pages.reduce((acc, p) => ({ ...acc, [p.id]: p.isLiked }), {} as Record<string, boolean>)
  );

  const toggleLike = (id: string) => {
    setLikedPages((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-foreground">Pages</h1>
          <Button size="sm" className="gradient-earn text-earn-foreground gap-1.5">
            <Plus className="h-4 w-4" /> Create Page
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search pages..." className="pl-9 bg-secondary border-0 rounded-full" />
        </div>

        <Tabs defaultValue="liked">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="liked" className="flex-1">Liked Pages</TabsTrigger>
            <TabsTrigger value="discover" className="flex-1">Discover</TabsTrigger>
          </TabsList>

          <TabsContent value="liked" className="mt-4 space-y-3">
            {pages.filter(p => likedPages[p.id]).map((page, i) => (
              <motion.div key={page.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-center p-3 gap-3">
                    <Avatar className="h-14 w-14 rounded-lg">
                      <AvatarImage src={page.avatar} />
                      <AvatarFallback>{page.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-foreground">{page.name}</h3>
                      <p className="text-xs text-muted-foreground">{page.category} · {page.likesCount.toLocaleString()} likes</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleLike(page.id)}>
                      <ThumbsUp className="h-3 w-3 mr-1 fill-primary text-primary" /> Liked
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="discover" className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pages.filter(p => !likedPages[p.id]).map((page, i) => (
              <motion.div key={page.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden">
                  <img src={page.cover} alt={page.name} className="w-full h-28 object-cover" />
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 -mt-7 mb-2">
                      <Avatar className="h-12 w-12 border-2 border-card">
                        <AvatarImage src={page.avatar} />
                        <AvatarFallback>{page.name[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">{page.name}</h3>
                    <p className="text-xs text-muted-foreground">{page.category} · {page.likesCount.toLocaleString()} likes</p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="flex-1" onClick={() => toggleLike(page.id)}>
                        <ThumbsUp className="h-3 w-3 mr-1" /> Like Page
                      </Button>
                      <Badge variant="secondary" className="text-[10px] gap-1">
                        <Coins className="h-3 w-3" />+3 SEP
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

export default Pages;
