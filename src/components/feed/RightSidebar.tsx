import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserPlus, MessageCircle, X, ChevronDown, ExternalLink, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const sponsoredAds = [
  {
    id: "ad1",
    title: "Premium Craft Spirits",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&h=200&fit=crop",
    link: "premiumspirits.com",
    description: "Toast to a refined celebration with premium craft spirits.",
  },
  {
    id: "ad2",
    title: "Learn Design Online",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=300&h=200&fit=crop",
    link: "designacademy.io",
    description: "Master UI/UX design with expert-led courses.",
  },
];

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_online: boolean | null;
  friends_count: number | null;
}

const RightSidebar = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chatOpen, setChatOpen] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState("");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [contacts, setContacts] = useState<Profile[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Fetch friend suggestions
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: reqs } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      const connected = new Set<string>([user.id]);
      reqs?.forEach(r => { connected.add(r.sender_id); connected.add(r.receiver_id); });

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, is_online, friends_count')
        .not('id', 'in', `(${Array.from(connected).join(',')})`)
        .limit(5);

      setSuggestions((data || []) as Profile[]);
    };
    fetch();
  }, [user]);

  // Fetch contacts (accepted friends)
  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data: reqs } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .eq('status', 'accepted')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);

      if (!reqs || reqs.length === 0) { setContacts([]); return; }

      const friendIds = reqs.map(r => r.sender_id === user.id ? r.receiver_id : r.sender_id);
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, is_online, friends_count')
        .in('id', friendIds);

      setContacts((data || []) as Profile[]);
    };
    fetch();
  }, [user]);

  // Fetch mini chat messages
  useEffect(() => {
    if (!chatOpen || !user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${chatOpen}),and(sender_id.eq.${chatOpen},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true })
        .limit(20);
      setChatMessages(data || []);
    };
    fetch();
  }, [chatOpen, user]);

  const sendMiniChat = async () => {
    if (!user || !chatOpen || !chatMsg.trim()) return;
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: chatOpen,
      content: chatMsg.trim(),
    });
    setChatMsg("");
    // Refetch
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${chatOpen}),and(sender_id.eq.${chatOpen},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })
      .limit(20);
    setChatMessages(data || []);
  };

  const sendFriendRequest = async (targetId: string) => {
    if (!user) return;
    const { error } = await supabase.from('friend_requests').insert({
      sender_id: user.id,
      receiver_id: targetId,
    });
    if (!error) {
      toast({ title: "Friend request sent!" });
      setDismissed(d => [...d, targetId]);
    }
  };

  const getInitials = (name: string | null) => (name || 'U')[0].toUpperCase();
  const chatUser = contacts.find(c => c.id === chatOpen);

  return (
    <div className="sticky top-[110px]">
      <ScrollArea className="h-[calc(100vh-120px)] pr-1">
        <div className="space-y-4">
          {/* Sponsored Ads */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 px-1">Sponsored</p>
            {sponsoredAds.map((ad) => (
              <div key={ad.id} className="flex gap-3 mb-3 cursor-pointer hover:bg-secondary/50 rounded-lg p-1.5 transition-colors">
                <img src={ad.image} alt={ad.title} className="h-[80px] w-[80px] rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{ad.title}</p>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{ad.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground">{ad.link}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t" />

          {/* Friend Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold text-muted-foreground">People You May Know</p>
              <Link to="/friends" className="text-xs text-primary hover:underline">See All</Link>
            </div>
            {suggestions
              .filter((s) => !dismissed.includes(s.id))
              .slice(0, 3)
              .map((person) => (
                <div key={person.id} className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={person.avatar_url || ''} />
                    <AvatarFallback>{getInitials(person.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{person.full_name || 'User'}</p>
                    <p className="text-[11px] text-muted-foreground">{person.friends_count || 0} friends</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full bg-primary/10 text-primary hover:bg-primary/20" onClick={() => sendFriendRequest(person.id)}>
                      <UserPlus className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 rounded-full" onClick={() => setDismissed((d) => [...d, person.id])}>
                      <X className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <div className="border-t" />

          {/* Online Friends & Chat */}
          <div>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold text-muted-foreground">Contacts</p>
              <Link to="/messages" className="text-xs text-primary hover:underline">
                <MessageCircle className="h-3.5 w-3.5" />
              </Link>
            </div>
            {contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground px-1">Add friends to see contacts</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setChatOpen(chatOpen === contact.id ? null : contact.id)}
                  className="flex items-center gap-2.5 p-1.5 rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contact.avatar_url || ''} />
                      <AvatarFallback>{getInitials(contact.full_name)}</AvatarFallback>
                    </Avatar>
                    {contact.is_online && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />
                    )}
                  </div>
                  <span className="text-sm text-foreground">{contact.full_name || 'User'}</span>
                </div>
              ))
            )}

            {/* Mini Chat Box */}
            {chatOpen && chatUser && (
              <Card className="mt-2 overflow-hidden">
                <div className="flex items-center justify-between p-2 border-b bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={chatUser.avatar_url || ''} />
                      <AvatarFallback>{getInitials(chatUser.full_name)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground">{chatUser.full_name || 'User'}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setChatOpen(null)}>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setChatOpen(null)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-2">
                  <div className="h-[120px] overflow-y-auto space-y-1">
                    {chatMessages.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        Start a conversation
                      </div>
                    ) : (
                      chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl px-2 py-1 text-xs ${
                            msg.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-1.5 mt-1">
                    <Input
                      value={chatMsg}
                      onChange={(e) => setChatMsg(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMiniChat()}
                      placeholder="Aa"
                      className="h-7 text-xs bg-secondary border-0 rounded-full"
                    />
                    <Button size="icon" className="h-7 w-7 shrink-0 bg-primary rounded-full" disabled={!chatMsg.trim()} onClick={sendMiniChat}>
                      <Send className="h-3 w-3 text-primary-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default RightSidebar;
