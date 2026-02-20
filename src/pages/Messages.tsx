import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Send, Phone, Video, Info, Smile, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_online: boolean | null;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

interface Conversation {
  profile: Profile;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversation list
  const fetchConversations = useCallback(async () => {
    if (!user) return;

    // Get all messages involving this user
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!msgs) return;

    // Group by other user
    const convMap = new Map<string, { lastMsg: Message; unread: number }>();
    msgs.forEach(msg => {
      const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          lastMsg: msg,
          unread: msg.sender_id !== user.id && !msg.read_at ? 1 : 0,
        });
      } else {
        const existing = convMap.get(otherId)!;
        if (msg.sender_id !== user.id && !msg.read_at) {
          existing.unread++;
        }
      }
    });

    // Fetch profiles
    const userIds = Array.from(convMap.keys());
    if (userIds.length === 0) { setConversations([]); return; }

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, is_online')
      .in('id', userIds);

    const profileMap = new Map<string, Profile>();
    profiles?.forEach(p => profileMap.set(p.id, p as Profile));

    const convList: Conversation[] = [];
    convMap.forEach((val, id) => {
      const profile = profileMap.get(id);
      if (profile) {
        convList.push({
          profile,
          lastMessage: val.lastMsg.content,
          lastTime: new Date(val.lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: val.unread,
        });
      }
    });

    setConversations(convList);
  }, [user]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (otherId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true });
    if (data) setMessages(data);

    // Mark as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('sender_id', otherId)
      .eq('receiver_id', user.id)
      .is('read_at', null);
  }, [user]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (selectedProfile) fetchMessages(selectedProfile.id);
  }, [selectedProfile, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Realtime messages
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message;
        if (msg.sender_id === user.id || msg.receiver_id === user.id) {
          if (selectedProfile && (msg.sender_id === selectedProfile.id || msg.receiver_id === selectedProfile.id)) {
            setMessages(prev => [...prev, msg]);
          }
          fetchConversations();
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, selectedProfile, fetchConversations]);

  const handleSend = async () => {
    if (!user || !selectedProfile || !newMessage.trim()) return;
    const { error } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: selectedProfile.id,
      content: newMessage.trim(),
    });
    if (!error) setNewMessage("");
  };

  const getInitials = (name: string | null) => (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden">
          <div className="flex h-[calc(100vh-140px)]">
            {/* Conversation list */}
            <div className={`w-full sm:w-80 border-r flex flex-col shrink-0 ${selectedProfile ? "hidden sm:flex" : "flex"}`}>
              <div className="p-3 border-b">
                <h2 className="font-display font-bold text-lg text-foreground mb-2">Chats</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-9 bg-secondary border-0 rounded-full h-8 text-xs"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No conversations yet. Start a chat with a friend!
                  </div>
                ) : (
                  conversations
                    .filter(c => !search || c.profile.full_name?.toLowerCase().includes(search.toLowerCase()))
                    .map((conv) => (
                    <div
                      key={conv.profile.id}
                      onClick={() => setSelectedProfile(conv.profile)}
                      className={`flex items-center gap-2.5 p-3 cursor-pointer hover:bg-secondary/50 transition-colors ${
                        selectedProfile?.id === conv.profile.id ? "bg-secondary" : ""
                      }`}
                    >
                      <div className="relative shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.profile.avatar_url || ''} />
                          <AvatarFallback>{getInitials(conv.profile.full_name)}</AvatarFallback>
                        </Avatar>
                        {conv.profile.is_online && (
                          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-primary border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${conv.unread ? "font-bold text-foreground" : "text-foreground"}`}>
                            {conv.profile.full_name || 'User'}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0">{conv.lastTime}</span>
                        </div>
                        <p className={`text-xs truncate ${conv.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <div className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shrink-0">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat area */}
            {selectedProfile ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2.5 p-3 border-b">
                  <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8" onClick={() => setSelectedProfile(null)}>
                    ←
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedProfile.avatar_url || ''} />
                    <AvatarFallback>{getInitials(selectedProfile.full_name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{selectedProfile.full_name || 'User'}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {selectedProfile.is_online ? "Active now" : "Offline"}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Info className="h-4 w-4 text-muted-foreground" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                          isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <p className={`text-[10px] ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            {isOwn && msg.read_at && (
                              <span className="text-[10px] text-primary-foreground/60">✓✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-3 border-t flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Plus className="h-4 w-4 text-primary" /></Button>
                  <Input
                    placeholder="Aa"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    className="bg-secondary border-0 rounded-full h-9 text-sm"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0"><Smile className="h-4 w-4 text-muted-foreground" /></Button>
                  <Button size="icon" className="h-8 w-8 shrink-0 bg-primary" onClick={handleSend} disabled={!newMessage.trim()}>
                    <Send className="h-3.5 w-3.5 text-primary-foreground" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex-1 hidden sm:flex items-center justify-center text-muted-foreground text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Messages;
