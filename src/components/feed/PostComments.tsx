import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface PostCommentsProps {
  postId: string;
  commentsCount: number;
}

const PostComments = ({ postId, commentsCount }: PostCommentsProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, content, created_at, profiles!comments_author_id_fkey(full_name, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true })
      .limit(showAll ? 50 : 3);
    setComments((data || []) as unknown as Comment[]);
    setLoaded(true);
  };

  useEffect(() => {
    fetchComments();
  }, [postId, showAll]);

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;
    setSubmitting(true);
    await supabase.from("comments").insert({
      post_id: postId,
      author_id: user.id,
      content: newComment.trim(),
    });
    setNewComment("");
    setSubmitting(false);
    fetchComments();
  };

  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || "";
  const initials = (profile?.full_name || "U")[0].toUpperCase();

  return (
    <div className="px-3 pb-3">
      {/* Comment list */}
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2 mb-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={c.profiles?.avatar_url || ""} />
            <AvatarFallback className="text-xs">{(c.profiles?.full_name || "U")[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="bg-secondary rounded-2xl px-3 py-1.5">
              <p className="text-xs font-semibold text-foreground">{c.profiles?.full_name || "User"}</p>
              <p className="text-sm text-foreground">{c.content}</p>
            </div>
            <div className="flex gap-3 mt-0.5 px-2">
              <span className="text-[11px] text-muted-foreground">
                {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
              </span>
              <button className="text-[11px] font-semibold text-muted-foreground hover:underline">Like</button>
              <button className="text-[11px] font-semibold text-muted-foreground hover:underline">Reply</button>
            </div>
          </div>
        </div>
      ))}

      {commentsCount > 3 && !showAll && loaded && (
        <button onClick={() => setShowAll(true)} className="text-xs font-semibold text-muted-foreground hover:underline mb-2 px-2">
          View all {commentsCount} comments
        </button>
      )}

      {/* Comment input */}
      {user && (
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex items-center bg-secondary rounded-full px-3">
            <Input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submitComment()}
              placeholder="Write a comment..."
              className="border-0 bg-transparent h-8 text-sm focus-visible:ring-0 p-0"
            />
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" disabled={submitting || !newComment.trim()} onClick={submitComment}>
              {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5 text-primary" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComments;
