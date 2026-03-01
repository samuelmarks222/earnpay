import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import {
  Image, Video, Smile, Globe, Users, Lock, Loader2,
  MapPin, UserPlus, MoreHorizontal, X
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEarnings } from "@/hooks/useEarnings";
import { useProfile } from "@/hooks/useProfile";
import AudienceSelector, { type AudienceType } from "./AudienceSelector";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const privacyMap: Record<AudienceType, { icon: React.ElementType; label: string; dbValue: string }> = {
  public: { icon: Globe, label: "Public", dbValue: "public" },
  friends: { icon: Users, label: "Friends", dbValue: "friends" },
  friends_except: { icon: Users, label: "Friends except...", dbValue: "friends" },
  specific_friends: { icon: Users, label: "Specific friends", dbValue: "friends" },
  private: { icon: Lock, label: "Only me", dbValue: "private" },
  custom: { icon: Users, label: "Custom", dbValue: "friends" },
};

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();
  const { awardSEP } = useEarnings();
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState<AudienceType>("friends");
  const [audienceSelectorOpen, setAudienceSelectorOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [posting, setPosting] = useState(false);

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const firstName = displayName.split(" ")[0];

  const PrivacyIcon = privacyMap[audience].icon;

  const handlePost = async () => {
    if (!user || (!content.trim() && !imageUrl)) return;
    setPosting(true);

    const postType = imageUrl ? "photo" : "text";
    const { data, error } = await supabase.from("posts").insert({
      author_id: user.id,
      content: content.trim(),
      post_type: postType,
      media_urls: imageUrl ? [imageUrl] : [],
      privacy: privacyMap[audience].dbValue,
    }).select().single();

    if (!error && data) {
      await awardSEP("post_created", data.id, "Created a post");
      toast({ title: "+5 SEP earned! 🎉", description: "You earned SocialEarn Points for posting." });
      setContent("");
      setImageUrl("");
      setShowImageInput(false);
      setModalOpen(false);
      onPostCreated?.();
    } else {
      toast({ title: "Error posting", description: error?.message, variant: "destructive" });
    }
    setPosting(false);
  };

  const addToPostButtons = [
    { icon: Image, color: "text-primary", label: "Photo/Video", onClick: () => setShowImageInput(true) },
    { icon: UserPlus, color: "text-primary", label: "Tag People", onClick: () => {} },
    { icon: Smile, color: "text-accent-foreground", label: "Feeling", onClick: () => {} },
    { icon: MapPin, color: "text-destructive", label: "Check in", onClick: () => {} },
    { icon: Video, color: "text-primary", label: "GIF", onClick: () => {} },
    { icon: MoreHorizontal, color: "text-muted-foreground", label: "More", onClick: () => {} },
  ];

  return (
    <>
      {/* Collapsed trigger card */}
      <Card className="rounded-none sm:rounded-xl border-x-0 sm:border-x shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 shrink-0">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div
              className="flex-1 rounded-full bg-secondary px-5 py-3 text-base text-muted-foreground cursor-pointer hover:bg-secondary/70 transition-colors"
              onClick={() => setModalOpen(true)}
            >
              What's on your mind, {firstName}?
            </div>
          </div>
          <div className="flex items-center justify-around mt-4 pt-3 border-t">
            {[
              { icon: Video, label: "Live video", color: "text-destructive" },
              { icon: Image, label: "Photo/video", color: "text-primary" },
              { icon: Smile, label: "Feeling/activity", color: "text-yellow-500" },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} onClick={() => setModalOpen(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg px-4 py-2 transition-colors font-medium">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full create post modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0">
          <DialogHeader className="p-4 pb-3 border-b">
            <DialogTitle className="text-center text-lg font-bold">Create post</DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-3">
            {/* User info + audience */}
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-foreground">{displayName}</p>
                <button
                  onClick={() => setAudienceSelectorOpen(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary hover:bg-secondary/70 rounded px-2 py-0.5 transition-colors"
                >
                  <PrivacyIcon className="h-3 w-3" />
                  <span>{privacyMap[audience].label}</span>
                  <span className="text-[10px]">▼</span>
                </button>
              </div>
            </div>

            {/* Text area */}
            <Textarea
              placeholder={`What's on your mind, ${firstName}?`}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="min-h-[120px] text-lg resize-none border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
              autoFocus
            />

            {/* Image input */}
            {showImageInput && (
              <div className="relative border rounded-lg p-3">
                <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => { setShowImageInput(false); setImageUrl(""); }}>
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-primary" />
                  <input
                    type="text"
                    placeholder="Paste image URL..."
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                {imageUrl && (
                  <img src={imageUrl} alt="preview" className="w-full max-h-48 object-cover rounded-lg mt-2" onError={() => setImageUrl("")} />
                )}
              </div>
            )}

            {/* Emoji + Aa bar (decorative) */}
            <div className="flex items-center justify-between">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-destructive via-accent to-primary flex items-center justify-center text-primary-foreground text-xs font-bold">Aa</div>
              <Smile className="h-6 w-6 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
            </div>
          </div>

          {/* Add to your post */}
          <div className="mx-4 mb-3 flex items-center justify-between border rounded-lg px-3 py-2.5">
            <span className="text-sm font-semibold text-foreground">Add to your post</span>
            <div className="flex items-center gap-1">
              {addToPostButtons.map((btn, i) => (
                <button key={i} onClick={btn.onClick} className="p-1.5 rounded-full hover:bg-secondary transition-colors">
                  <btn.icon className={`h-5 w-5 ${btn.color}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Post button */}
          <div className="px-4 pb-4">
            <Button
              className="w-full h-10 text-base font-semibold bg-secondary text-muted-foreground hover:bg-secondary/80"
              onClick={handlePost}
              disabled={posting || (!content.trim() && !imageUrl)}
            >
              {posting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Audience selector */}
      <AudienceSelector
        open={audienceSelectorOpen}
        onOpenChange={setAudienceSelectorOpen}
        value={audience}
        onChange={setAudience}
      />
    </>
  );
};

export default CreatePost;
