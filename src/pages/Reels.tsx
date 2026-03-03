import { useState, useEffect } from "react";
import { Play, Heart, MessageCircle, Share2, Eye, Loader2, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEarnings } from "@/hooks/useEarnings";

const Reels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { awardSEP } = useEarnings();
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ content: "", media_url: "" });

  const fetchReels = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("*, profiles!posts_author_id_fkey(id, full_name, avatar_url, username)")
      .in("post_type", ["reel", "video"])
      .eq("privacy", "public")
      .order("created_at", { ascending: false })
      .limit(30);
    setReels(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchReels(); }, []);

  const createReel = async () => {
    if (!user || !form.media_url.trim()) return;
    setCreating(true);
    const { data, error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: form.content.trim(),
      post_type: "reel",
      media_urls: [form.media_url.trim()],
      privacy: "public",
    }).select().single();

    if (!error && data) {
      await awardSEP("reel_created", data.id, "Created a reel");
      toast({ title: "+10 SEP earned! 🎬", description: "You earned points for posting a reel." });
      setCreateOpen(false);
      setForm({ content: "", media_url: "" });
      fetchReels();
    } else {
      toast({ title: "Error", description: error?.message, variant: "destructive" });
    }
    setCreating(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Reels & Videos</h1>
          <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Create Reel
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : reels.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl font-medium">No reels yet!</p>
            <p className="mt-2">Be the first to create a reel.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {reels.map((reel, i) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-xl overflow-hidden cursor-pointer group aspect-[9/16]"
              >
                <img
                  src={reel.media_urls?.[0] || "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=500&fit=crop"}
                  alt={reel.content || "Reel"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="h-6 w-6 text-white fill-white ml-1" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-7 w-7 border border-white/50">
                      <AvatarImage src={reel.profiles?.avatar_url} />
                      <AvatarFallback className="text-[10px]">{(reel.profiles?.full_name || "U")[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-white truncate">{reel.profiles?.full_name || "User"}</span>
                  </div>
                  <p className="text-xs text-white/90 truncate">{reel.content}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/70">
                    <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{reel.views_count || 0}</span>
                    <span className="flex items-center gap-0.5"><Heart className="h-3 w-3" />{reel.reactions_count || 0}</span>
                    <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3" />{reel.comments_count || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Reel</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Video/Image URL</Label><Input value={form.media_url} onChange={e => setForm(f => ({ ...f, media_url: e.target.value }))} placeholder="Paste video or image URL..." /></div>
            <div><Label>Caption</Label><Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Add a caption..." /></div>
            {form.media_url && <img src={form.media_url} alt="preview" className="w-full max-h-48 object-cover rounded-lg" onError={() => {}} />}
            <Button className="w-full" onClick={createReel} disabled={creating || !form.media_url.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post Reel (+10 SEP)"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Reels;
