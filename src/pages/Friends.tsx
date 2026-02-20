import { useState, useEffect, useCallback } from "react";
import { Search, UserPlus, MessageCircle, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  friends_count: number | null;
  is_online: boolean | null;
  country: string | null;
}

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  profile: Profile;
}

const Friends = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Profile[]>([]);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('receiver_id', user.id)
      .eq('status', 'pending');

    if (!data) return;

    // Fetch sender profiles
    const senderIds = data.map(r => r.sender_id);
    if (senderIds.length === 0) { setRequests([]); return; }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, friends_count, is_online, country')
      .in('id', senderIds);

    const profileMap = new Map<string, Profile>();
    profiles?.forEach(p => profileMap.set(p.id, p as Profile));

    setRequests(data.map(r => ({
      ...r,
      profile: profileMap.get(r.sender_id) || { id: r.sender_id, full_name: 'User', avatar_url: null, friends_count: 0, is_online: false, country: null },
    })));
  }, [user]);

  const fetchFriends = useCallback(async () => {
    if (!user) return;
    // Friends = accepted friend requests (both directions)
    const { data } = await supabase
      .from('friend_requests')
      .select('sender_id, receiver_id')
      .eq('status', 'accepted')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    if (!data || data.length === 0) { setFriends([]); return; }

    const friendIds = data.map(r => r.sender_id === user.id ? r.receiver_id : r.sender_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, friends_count, is_online, country')
      .in('id', friendIds);

    setFriends((profiles || []) as Profile[]);
  }, [user]);

  const fetchSuggestions = useCallback(async () => {
    if (!user) return;
    const { data: allRequests } = await supabase
      .from('friend_requests')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

    const connectedIds = new Set<string>([user.id]);
    allRequests?.forEach(r => { connectedIds.add(r.sender_id); connectedIds.add(r.receiver_id); });

    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, friends_count, is_online, country')
      .not('id', 'in', `(${Array.from(connectedIds).join(',')})`)
      .limit(8);

    setSuggestions((data || []) as Profile[]);
  }, [user]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchRequests(), fetchFriends(), fetchSuggestions()]).finally(() => setLoading(false));
  }, [fetchRequests, fetchFriends, fetchSuggestions]);

  const handleAccept = async (requestId: string) => {
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', requestId);
    toast({ title: "Friend request accepted! 🎉" });
    fetchRequests();
    fetchFriends();
  };

  const handleDecline = async (requestId: string) => {
    await supabase.from('friend_requests').delete().eq('id', requestId);
    setRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleAddFriend = async (targetId: string) => {
    if (!user) return;
    const { error } = await supabase.from('friend_requests').insert({
      sender_id: user.id,
      receiver_id: targetId,
    });
    if (!error) {
      toast({ title: "Friend request sent!" });
      setSuggestions(prev => prev.filter(s => s.id !== targetId));
    }
  };

  const getInitials = (name: string | null) => (name || 'U')[0].toUpperCase();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="font-display text-xl font-bold text-foreground">Friends</h1>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            className="pl-9 bg-secondary border-0 rounded-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <Tabs defaultValue="requests">
          <TabsList className="w-full bg-secondary">
            <TabsTrigger value="requests" className="flex-1">Requests ({requests.length})</TabsTrigger>
            <TabsTrigger value="all" className="flex-1">All Friends ({friends.length})</TabsTrigger>
            <TabsTrigger value="suggestions" className="flex-1">Suggestions</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="mt-4 space-y-3">
            {requests.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No pending requests</p>
            ) : (
              requests.map((req, i) => (
                <motion.div key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-3 flex items-center gap-3">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={req.profile.avatar_url || ''} />
                        <AvatarFallback>{getInitials(req.profile.full_name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{req.profile.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">
                          {req.profile.friends_count || 0} friends{req.profile.country ? ` · ${req.profile.country}` : ''}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="bg-primary text-primary-foreground text-xs" onClick={() => handleAccept(req.id)}>
                            Confirm
                          </Button>
                          <Button size="sm" variant="secondary" className="text-xs" onClick={() => handleDecline(req.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-4 space-y-2">
            {friends.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">No friends yet. Send some requests!</p>
            ) : (
              friends
                .filter(f => !search || f.full_name?.toLowerCase().includes(search.toLowerCase()))
                .map((friend, i) => (
                <motion.div key={friend.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                  <Card>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={friend.avatar_url || ''} />
                          <AvatarFallback>{getInitials(friend.full_name)}</AvatarFallback>
                        </Avatar>
                        {friend.is_online && (
                          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{friend.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{friend.friends_count || 0} friends</p>
                      </div>
                      <Link to="/messages">
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                          <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="mt-4 grid grid-cols-2 gap-3">
            {suggestions.length === 0 ? (
              <p className="col-span-2 text-center text-sm text-muted-foreground py-8">No suggestions available</p>
            ) : (
              suggestions.map((person, i) => (
                <motion.div key={person.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
                  <Card className="overflow-hidden">
                    <div className="h-28 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Avatar className="h-16 w-16 ring-2 ring-card">
                        <AvatarImage src={person.avatar_url || ''} />
                        <AvatarFallback className="text-xl">{getInitials(person.full_name)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-semibold text-sm truncate">{person.full_name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">
                        {person.friends_count || 0} friends{person.country ? ` · ${person.country}` : ''}
                      </p>
                      <Button size="sm" className="w-full mt-2 gap-1 text-xs" onClick={() => handleAddFriend(person.id)}>
                        <UserPlus className="h-3 w-3" /> Add Friend
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Friends;
