import { useState, useEffect } from "react";
import { Search, Plus, Users, TrendingUp, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Groups = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<any[]>([]);
  const [myGroupIds, setMyGroupIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", privacy: "public", cover_url: "" });

  const fetchGroups = async () => {
    setLoading(true);
    const { data } = await supabase.from("groups").select("*").order("created_at", { ascending: false });
    setGroups(data || []);

    if (user) {
      const { data: memberships } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);
      setMyGroupIds(new Set((memberships || []).map((m: any) => m.group_id)));
    }
    setLoading(false);
  };

  useEffect(() => { fetchGroups(); }, [user]);

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    await supabase.from("group_members").insert({ group_id: groupId, user_id: user.id });
    setMyGroupIds(prev => new Set(prev).add(groupId));
    toast({ title: "Joined group!" });
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    await supabase.from("group_members").delete().eq("group_id", groupId).eq("user_id", user.id);
    setMyGroupIds(prev => { const n = new Set(prev); n.delete(groupId); return n; });
  };

  const createGroup = async () => {
    if (!user || !form.name.trim()) return;
    setCreating(true);
    const { data, error } = await supabase.from("groups").insert({
      name: form.name.trim(),
      description: form.description.trim(),
      privacy: form.privacy,
      cover_url: form.cover_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
      creator_id: user.id,
    }).select().single();

    if (!error && data) {
      await supabase.from("group_members").insert({ group_id: data.id, user_id: user.id, role: "admin" });
      toast({ title: "Group created! 🎉" });
      setCreateOpen(false);
      setForm({ name: "", description: "", privacy: "public", cover_url: "" });
      fetchGroups();
    } else {
      toast({ title: "Error", description: error?.message, variant: "destructive" });
    }
    setCreating(false);
  };

  const filtered = groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const myGroups = filtered.filter(g => myGroupIds.has(g.id));
  const discoverGroups = filtered.filter(g => !myGroupIds.has(g.id));

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Groups</h1>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Create Group
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search groups..." className="pl-9 bg-secondary border-0 rounded-full" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : (
          <Tabs defaultValue="your-groups">
            <TabsList className="w-full bg-secondary">
              <TabsTrigger value="your-groups" className="flex-1">Your Groups ({myGroups.length})</TabsTrigger>
              <TabsTrigger value="discover" className="flex-1">Discover ({discoverGroups.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="your-groups" className="mt-4 space-y-3">
              {myGroups.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-muted-foreground text-sm">Join some groups to see them here!</CardContent></Card>
              ) : myGroups.map((group, i) => (
                <motion.div key={group.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex">
                      <img src={group.cover_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop"} alt={group.name} className="w-24 h-24 object-cover shrink-0" />
                      <CardContent className="p-3 flex-1">
                        <h3 className="font-semibold text-sm text-foreground">{group.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{group.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="h-3 w-3" />{group.members_count || 1}</span>
                          <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => leaveGroup(group.id)}>Leave</Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </TabsContent>

            <TabsContent value="discover" className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discoverGroups.length === 0 ? (
                <Card className="col-span-full"><CardContent className="p-8 text-center text-muted-foreground text-sm">No groups to discover.</CardContent></Card>
              ) : discoverGroups.map((group, i) => (
                <motion.div key={group.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden">
                    <img src={group.cover_url || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop"} alt={group.name} className="w-full h-32 object-cover" />
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm text-foreground">{group.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{group.members_count || 1} members</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{group.description}</p>
                      <Button size="sm" className="w-full mt-3" onClick={() => joinGroup(group.id)}>Join Group</Button>
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
          <DialogHeader><DialogTitle>Create New Group</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Group Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter group name" /></div>
            <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="What is this group about?" /></div>
            <div><Label>Privacy</Label>
              <Select value={form.privacy} onValueChange={v => setForm(f => ({ ...f, privacy: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="public">Public</SelectItem><SelectItem value="private">Private</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Cover Image URL (optional)</Label><Input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="https://..." /></div>
            <Button className="w-full" onClick={createGroup} disabled={creating || !form.name.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Group"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Groups;
