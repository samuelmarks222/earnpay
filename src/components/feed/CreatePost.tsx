import { useState } from "react";
import { Image, Video, Smile, MapPin, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser } from "@/lib/mock-data";
import { motion } from "framer-motion";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div
              contentEditable
              suppressContentEditableWarning
              className="min-h-[40px] rounded-xl bg-secondary px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              onFocus={() => setFocused(true)}
              onBlur={(e) => {
                setContent(e.currentTarget.textContent || "");
                if (!e.currentTarget.textContent) setFocused(false);
              }}
              data-placeholder="What's on your mind, Alex?"
              style={{ 
                minHeight: focused ? "80px" : "40px",
              }}
            />
          </div>
        </div>

        <motion.div
          initial={false}
          animate={{ height: focused ? "auto" : 0, opacity: focused ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="flex items-center justify-between pt-3 mt-3 border-t">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 text-xs">
                <Image className="h-4 w-4 text-primary" /> Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 text-xs">
                <Video className="h-4 w-4 text-destructive" /> Video
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 text-xs">
                <Smile className="h-4 w-4 text-accent" /> Feeling
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5 text-xs">
                <MapPin className="h-4 w-4 text-primary" /> Location
              </Button>
            </div>
            <Button size="sm" className="gradient-earn text-earn-foreground gap-1.5">
              <Send className="h-3.5 w-3.5" /> Post & Earn
            </Button>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
