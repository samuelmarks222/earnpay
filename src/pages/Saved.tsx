import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Image, Video, FileText } from "lucide-react";
import { posts } from "@/lib/mock-data";

const Saved = () => {
  const savedPosts = posts.slice(0, 4);

  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Saved Items</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex gap-3 p-3">
                {(post.image || post.images?.[0]) ? (
                  <img src={post.image || post.images?.[0]} alt="" className="h-20 w-20 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="h-20 w-20 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{post.author.name} · {post.createdAt}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Bookmark className="h-3 w-3 text-primary" />
                    <span className="text-[11px] text-primary font-medium">Saved</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Saved;
