import { useState, useEffect } from "react";
import { UserPlus, X, Users } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Suggestion {
  id: string;
  full_name: string;
  avatar_url: string;
  country: string | null;
  friends_count: number;
}

const FeedFriendSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchSuggestions = async () => {
      // Get users that aren't already friends or have pending requests
      const { data: existingRequests } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const connectedIds = new Set<string>([user.id]);
      existingRequests?.forEach(r => {
        connectedIds.add(r.sender_id);
        connectedIds.add(r.receiver_id);
      });

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, country, friends_count')
        .not('id', 'in', `(${Array.from(connectedIds).join(',')})`)
        .limit(6);

      if (data) setSuggestions(data as Suggestion[]);
    };
    fetchSuggestions();
  }, [user]);

  const sendFriendRequest = async (targetId: string) => {
    if (!user) return;
    setSending(targetId);
    const { error } = await supabase.from('friend_requests').insert({
      sender_id: user.id,
      receiver_id: targetId,
    });
    if (!error) {
      toast({ title: "Friend request sent! 🎉" });
      setDismissed(d => [...d, targetId]);
    } else {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSending(null);
  };

  const visible = suggestions.filter(s => !dismissed.includes(s.id));
  if (visible.length === 0) return null;

  return (
    <Card className="overflow-hidden rounded-none sm:rounded-xl border-x-0 sm:border-x">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">People You May Know</h3>
          </div>
          <Link to="/friends" className="text-xs text-primary hover:underline">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {visible.slice(0, 4).map((person) => (
            <div key={person.id} className="shrink-0 w-[160px] rounded-xl border overflow-hidden bg-card">
              <div className="h-20 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Avatar className="h-14 w-14 ring-2 ring-card">
                  <AvatarImage src={person.avatar_url || ''} />
                  <AvatarFallback className="text-lg">{(person.full_name || 'U')[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="p-3 text-center">
                <p className="font-semibold text-sm text-foreground truncate">{person.full_name || 'User'}</p>
                <p className="text-[11px] text-muted-foreground mb-2">
                  {person.friends_count || 0} friends{person.country ? ` · ${person.country}` : ''}
                </p>
                <Button
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={() => sendFriendRequest(person.id)}
                  disabled={sending === person.id}
                >
                  <UserPlus className="h-3 w-3" /> Add Friend
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full mt-1 text-xs text-muted-foreground"
                  onClick={() => setDismissed(d => [...d, person.id])}
                >
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedFriendSuggestions;
