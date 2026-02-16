import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { friendRequests } from "@/lib/mock-data";

const FriendRequests = () => {
  const [visible, setVisible] = useState(true);
  const [requests, setRequests] = useState(friendRequests);

  if (!visible || requests.length === 0) return null;

  const handleConfirm = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };
  const handleDelete = (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground text-sm">Friend Requests</h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setVisible(false)}>
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {requests.map((req) => (
            <div key={req.id} className="shrink-0 w-[180px] rounded-xl border overflow-hidden bg-card">
              <img
                src={req.user.avatar}
                alt={req.user.name}
                className="w-full h-[180px] object-cover"
              />
              <div className="p-3">
                <p className="font-semibold text-sm text-foreground truncate">{req.user.name}</p>
                <div className="flex items-center gap-1 mt-1 mb-3">
                  <div className="flex -space-x-2">
                    <div className="h-4 w-4 rounded-full bg-muted border border-card" />
                    <div className="h-4 w-4 rounded-full bg-muted border border-card" />
                  </div>
                  <span className="text-[11px] text-muted-foreground">{req.mutualFriends} mutual friends</span>
                </div>
                <Button
                  size="sm"
                  className="w-full mb-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
                  onClick={() => handleConfirm(req.id)}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full text-xs"
                  onClick={() => handleDelete(req.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-primary font-medium mt-3 cursor-pointer hover:underline">
          See all &gt;
        </p>
      </CardContent>
    </Card>
  );
};

export default FriendRequests;
