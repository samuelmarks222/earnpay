import { useState } from "react";
import { Search, Send, Phone, Video, Info, Smile, Image, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { users, currentUser } from "@/lib/mock-data";
import MainLayout from "@/components/layout/MainLayout";

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

const conversations = users.filter(u => u.id !== currentUser.id).map((u, i) => ({
  user: u,
  lastMessage: ["Hey, how are you?", "Check out my latest post!", "Thanks for the share 🙌", "Let's catch up soon", "Nice design! 🎨", "The earning system is great", "See you at the meetup"][i] || "Hello!",
  time: ["2m", "15m", "1h", "3h", "5h", "1d", "2d"][i] || "now",
  unread: i < 2,
}));

const mockMessages: Message[] = [
  { id: "m1", senderId: "2", text: "Hey Alex! Have you seen the new earning features?", time: "10:30 AM" },
  { id: "m2", senderId: "1", text: "Yes! I love how transparent the dashboard is 💚", time: "10:32 AM" },
  { id: "m3", senderId: "2", text: "Right? I earned 50 SEP just from posting yesterday", time: "10:33 AM" },
  { id: "m4", senderId: "1", text: "That's amazing! My top post got 125 SEP 🔥", time: "10:35 AM" },
  { id: "m5", senderId: "2", text: "Wow, we should collab on some content!", time: "10:36 AM" },
  { id: "m6", senderId: "1", text: "Absolutely! Let's plan something this week", time: "10:38 AM" },
];

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(conversations[0]?.user || null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage("");
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">
        <Card className="overflow-hidden">
          <div className="flex h-[calc(100vh-140px)]">
            {/* Conversation list */}
            <div className={`w-full sm:w-80 border-r flex flex-col shrink-0 ${selectedUser ? "hidden sm:flex" : "flex"}`}>
              <div className="p-3 border-b">
                <h2 className="font-display font-bold text-lg text-foreground mb-2">Chats</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search messages..." className="pl-9 bg-secondary border-0 rounded-full h-8 text-xs" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.user.id}
                    onClick={() => setSelectedUser(conv.user)}
                    className={`flex items-center gap-2.5 p-3 cursor-pointer hover:bg-secondary/50 transition-colors ${
                      selectedUser?.id === conv.user.id ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conv.user.avatar} />
                        <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                      </Avatar>
                      {conv.user.isOnline && (
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${conv.unread ? "font-bold text-foreground" : "text-foreground"}`}>{conv.user.name}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0">{conv.time}</span>
                      </div>
                      <p className={`text-xs truncate ${conv.unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{conv.lastMessage}</p>
                    </div>
                    {conv.unread && <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Chat area */}
            {selectedUser ? (
              <div className={`flex-1 flex flex-col ${selectedUser ? "flex" : "hidden sm:flex"}`}>
                <div className="flex items-center gap-2.5 p-3 border-b">
                  <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8" onClick={() => setSelectedUser(null)}>
                    ←
                  </Button>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{selectedUser.name}</p>
                    <p className="text-[10px] text-muted-foreground">{selectedUser.isOnline ? "Active now" : "Offline"}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Phone className="h-4 w-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Video className="h-4 w-4 text-muted-foreground" /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Info className="h-4 w-4 text-muted-foreground" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                          isOwn ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[10px] mt-0.5 ${isOwn ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                        </div>
                      </div>
                    );
                  })}
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
                  <Button size="icon" className="h-8 w-8 shrink-0 bg-primary" onClick={handleSend}>
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
