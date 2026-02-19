import { useState, useEffect, useRef, useCallback } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video, Smile, Globe, Users, Lock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEarnings } from "@/hooks/useEarnings";
import { useProfile } from "@/hooks/useProfile";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const { awardSEP } = useEarnings();
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [imageUrl, setImageUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const handlePost = async () => {
    if (!user || (!content.trim() && !imageUrl)) return;
    setPosting(true);
    
    const postType = imageUrl ? 'photo' : 'text';
    const { data, error } = await supabase.from('posts').insert({
      author_id: user.id,
      content: content.trim(),
      post_type: postType,
      media_urls: imageUrl ? [imageUrl] : [],
      privacy,
    }).select().single();

    if (!error && data) {
      await awardSEP('post_created', data.id, 'Created a post');
      toast({ title: `+5 SEP earned! 🎉`, description: "You earned SocialEarn Points for posting." });
      setContent("");
      setImageUrl("");
      setExpanded(false);
      onPostCreated?.();
    } else {
      toast({ title: "Error posting", description: error?.message, variant: "destructive" });
    }
    setPosting(false);
  };

  const privacyIcon = { public: Globe, friends: Users, private: Lock }[privacy];
  const PrivacyIcon = privacyIcon;

  return (
    <Card className="rounded-none sm:rounded-xl border-x-0 sm:border-x shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div
            className="flex-1 rounded-full bg-secondary px-5 py-3 text-base text-muted-foreground cursor-pointer hover:bg-secondary/70 transition-colors"
            onClick={() => { setExpanded(true); setTimeout(() => textareaRef.current?.focus(), 100); }}
          >
            {expanded ? "" : `What's on your mind, ${displayName.split(" ")[0]}?`}
          </div>
        </div>

        {expanded && (
          <div className="mt-4 space-y-3">
            <Textarea
              ref={textareaRef}
              placeholder={`What's on your mind, ${displayName.split(" ")[0]}?`}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[120px] text-base resize-none border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground"
              autoFocus
            />
            <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-xl">
              <Image className="h-5 w-5 text-primary" />
              <input
                type="text"
                placeholder="Add image URL (optional)..."
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>
            {imageUrl && (
              <img src={imageUrl} alt="preview" className="w-full max-h-60 object-cover rounded-xl" onError={() => setImageUrl("")} />
            )}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1">
                {(['public', 'friends', 'private'] as const).map(p => (
                  <Button key={p} size="sm" variant={privacy === p ? "secondary" : "ghost"} onClick={() => setPrivacy(p)} className="text-sm gap-1.5">
                    <PrivacyIcon className="h-4 w-4" />
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setExpanded(false); setContent(""); setImageUrl(""); }}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="gradient-earn text-primary-foreground px-6"
                  onClick={handlePost}
                  disabled={posting || (!content.trim() && !imageUrl)}
                >
                  {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {!expanded && (
          <div className="flex items-center justify-around mt-4 pt-3 border-t">
            {[
              { icon: Video, label: "Live video", color: "text-destructive" },
              { icon: Image, label: "Photo/video", color: "text-primary" },
              { icon: Smile, label: "Feeling", color: "text-yellow-500" },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} onClick={() => setExpanded(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg px-4 py-2 transition-colors font-medium">
                <Icon className={`h-5 w-5 ${color}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatePost;
