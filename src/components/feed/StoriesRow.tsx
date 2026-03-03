import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";

interface StoryGroup {
  author_id: string;
  full_name: string;
  avatar_url: string;
  story_count: number;
  latest_media: string;
}

const StoriesRow = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const [stories, setStories] = useState<StoryGroup[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");

  const fetchStories = async () => {
    const { data } = await supabase
      .from("stories")
      .select("author_id, media_url, profiles!stories_author_id_fkey(full_name, avatar_url)")
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    if (data) {
      const grouped: Record<string, StoryGroup> = {};
      for (const s of data as any[]) {
        if (!grouped[s.author_id]) {
          grouped[s.author_id] = {
            author_id: s.author_id,
            full_name: s.profiles?.full_name || "User",
            avatar_url: s.profiles?.avatar_url || "",
            story_count: 0,
            latest_media: s.media_url,
          };
        }
        grouped[s.author_id].story_count++;
      }
      setStories(Object.values(grouped));
    }
  };

  useEffect(() => { fetchStories(); }, []);

  const createStory = async () => {
    if (!user || !mediaUrl.trim()) return;
    setCreating(true);
    const { error } = await supabase.from("stories").insert({
      author_id: user.id,
      media_url: mediaUrl.trim(),
      media_type: "image",
    });
    if (!error) {
      toast({ title: "Story posted! 📸" });
      setCreateOpen(false);
      setMediaUrl("");
      fetchStories();
    }
    setCreating(false);
  };

  const displayName = profile?.full_name || "You";
  const avatarUrl = profile?.avatar_url || "";

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Create story card */}
        <div
          onClick={() => setCreateOpen(true)}
          className="relative shrink-0 w-[110px] h-[190px] rounded-xl overflow-hidden cursor-pointer group border"
        >
          <img
            src={avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=300&fit=crop"}
            alt="Create story"
            className="w-full h-2/3 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-card pt-6 pb-2 text-center h-1/3">
            <p className="text-[11px] font-medium text-foreground">Create story</p>
          </div>
          <div className="absolute bottom-[45px] left-1/2 -translate-x-1/2 z-10">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center border-4 border-card">
              <Plus className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Story cards from DB */}
        {stories.map(story => (
          <div
            key={story.author_id}
            className="relative shrink-0 w-[110px] h-[190px] rounded-xl overflow-hidden cursor-pointer group"
          >
            <img
              src={story.latest_media}
              alt={story.full_name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute top-2 left-2">
              <Avatar className="h-9 w-9 ring-[3px] ring-primary">
                <AvatarImage src={story.avatar_url} />
                <AvatarFallback>{(story.full_name || "U")[0]}</AvatarFallback>
              </Avatar>
              {story.story_count > 1 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] p-0 flex items-center justify-center text-[10px] bg-destructive border-0 text-destructive-foreground">
                  {story.story_count}
                </Badge>
              )}
            </div>
            <p className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white truncate">
              {story.full_name.split(" ")[0]}
            </p>
          </div>
        ))}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Create Story</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Image URL</Label><Input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="Paste image URL..." /></div>
            {mediaUrl && <img src={mediaUrl} alt="preview" className="w-full max-h-48 object-cover rounded-lg" />}
            <Button className="w-full" onClick={createStory} disabled={creating || !mediaUrl.trim()}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share Story"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoriesRow;
