import { Image } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { currentUser } from "@/lib/mock-data";

const CreatePost = () => {
  return (
    <Card className="rounded-none sm:rounded-xl border-x-0 sm:border-x">
      <CardContent className="p-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground cursor-pointer hover:bg-secondary/70 transition-colors">
            What's on your mind?
          </div>
          <div className="shrink-0 text-primary cursor-pointer hover:bg-secondary rounded-full p-2 transition-colors">
            <Image className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
