import { useState, useEffect } from "react";
import { Search, Plus, ThumbsUp, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Pages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<any[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", category: "", avatar_url: "", cover_url: "" });

  const fetchPages = async () => {
    setLoading(true);
    const { data } = await supabase.from("pages").select("*").order("created_at", { ascending: false });
    setPages(data || []);
    if (user) {
      const { data: follows } = await supabase.from("page_followers").select("page_id").eq("user_id", user.id);
      setFollowedIds(new Set((follows || []).map((f: any) => f.page_id)));
    }
    setLoading(false);
  };

  useEffect(() => { fetchPages(); }, [user]);

  const toggleFollow = async (pageId: string) => {
    if (!user) return;
    if (followedIds.has(pageId)) {
      await supabase.from("page_followers").delete().eq("page_id", pageId).eq("user_id", user.id);
      setFollowedIds(prev => { const n = new Set(prev); n.delete(pageId); return n; });
    } else {
      await supabase.from("page_followers").insert({ page_id: pageId, user_id: user.id });
      setFollowedIds(prev => new Set(prev).add(pageId));
      toast({ title: "Following page!" });
    }
  };

  const createPage = async () => {
    if (!user || !form.name.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("pages").insert({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category || "General",
      avatar_url: form.avatar_url || "",
      cover_url: form.cover_url || "",
      creator_id: user.id,
    });
    if (!error) {
      toast({ title: "Page created! 🎉" });
      setCreateOpen(false);
      setForm({ name: "", description: "", category: "", avatar_url: "", cover_url: "" });
      fetchPages();
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const likedPages = pages.filter(p => followedIds.has(p.id));
  const discoverPages = pages.filter(p => !followedIds.has(p.id));

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Pages</h1>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Create Page
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Tabs defaultValue="liked">
            <TabsList className="w-full bg-secondary">
              <TabsTrigger value="liked" className="flex-1">Following ({likedPages.length})</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1">Discover ({discoverPages.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="liked" className="mt-4 space-y-3">
              {likedPages.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Follow pages to see them here.</CardContent></Card>
              ) : likedPages.map((page, i) => (
                <motion.div key={page.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-center p-3 gap-3">
                      <Avatar className="h-14 w-14 rounded-lg">
                        <AvatarImage src={page.avatar_url} />
                        <AvatarFallback>{page.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-foreground">{page.name}</h3>
                        <p className="text-xs text-muted-foreground">{page.category} · {page.followers_count || 0} followers</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs" onClick={() => toggleFollow(page.id)}>
                        <ThumbsUp className="h-3 w-3 mr-1 fill-primary text-primary" /> Following
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="discover" className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discoverPages.length === 0 ? (
                <Card className="col-span-full"><CardContent className="p-8 text-center text-muted-foreground text-sm">No pages to discover.</CardContent></Card>
              ) : discoverPages.map((page, i) => (
                <motion.div key={page.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden">
                    <img src={page.cover_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop"} alt={page.name} className="w-full h-28 object-cover" />
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 -mt-7 mb-2">
                        <Avatar className="h-12 w-12 border-2 border-card">
                          <AvatarImage src={page.avatar_url} />
                          <AvatarFallback>{page.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <h3 className="font-semibold text-sm text-foreground">{page.name}</h3>
                      <p className="text-xs text-muted-foreground">{page.category} · {page.followers_count || 0} followers</p>
                      <Button size="sm" className="w-full mt-3" onClick={() => toggleFollow(page.id)}>
                        <ThumbsUp className="h-3 w-3 mr-1" /> Follow
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create New Page</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Page Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter page name" /></div>
            <div><Label>Category</Label><Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Technology, Sports, Music" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What is this page about?" /></div>
            <Button className="w-full" onClick={createPage} disabled={creating || !form.name.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Page"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Pages;
