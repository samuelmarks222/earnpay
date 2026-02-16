import { Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { stories } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

const StoriesRow = () => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {stories.map((story) => (
        <div
          key={story.id}
          className="relative shrink-0 w-[110px] h-[190px] rounded-xl overflow-hidden cursor-pointer group"
        >
          <img
            src={story.image}
            alt={story.user.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {story.isOwn ? (
            <>
              <div className="absolute bottom-0 left-0 right-0 bg-card pt-6 pb-2 text-center">
                <p className="text-[11px] font-medium text-foreground">1 recent photo</p>
              </div>
              <div className="absolute bottom-[28px] left-1/2 -translate-x-1/2 z-10">
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center border-4 border-card">
                  <Plus className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="absolute top-2 left-2">
                <Avatar className="h-9 w-9 ring-[3px] ring-primary">
                  <AvatarImage src={story.user.avatar} />
                  <AvatarFallback>{story.user.name[0]}</AvatarFallback>
                </Avatar>
                {story.unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 min-w-[16px] p-0 flex items-center justify-center text-[10px] bg-destructive border-0 text-destructive-foreground">
                    {story.unreadCount}
                  </Badge>
                )}
              </div>
              <p className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white truncate">
                {story.user.name.split(" ")[0]}{"\n"}{story.user.name.split(" ")[1] || ""}
              </p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoriesRow;
