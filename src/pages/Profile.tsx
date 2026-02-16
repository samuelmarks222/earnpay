import { MapPin, Briefcase, Calendar, Users, UserPlus, Edit, Coins, Camera } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser, posts } from "@/lib/mock-data";
import PostCard from "@/components/feed/PostCard";
import MainLayout from "@/components/layout/MainLayout";

const Profile = () => {
  const userPosts = posts.filter((p) => p.author.id === currentUser.id);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Cover Photo */}
        <Card className="overflow-hidden">
          <div className="relative">
            <img
              src={currentUser.coverPhoto}
              alt="Cover"
              className="w-full h-48 md:h-64 object-cover"
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute bottom-3 right-3 gap-1.5 text-xs"
            >
              <Camera className="h-3 w-3" /> Edit Cover
            </Button>
          </div>

          <CardContent className="relative px-4 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-card shadow-lg">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="text-2xl">{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 sm:pb-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="font-display text-2xl font-bold text-foreground">{currentUser.name}</h1>
                  <Badge className="gradient-earn text-earn-foreground border-0 gap-1">
                    <Coins className="h-3 w-3" /> {currentUser.totalEarnings.toFixed(0)} SEP
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">@{currentUser.username}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="gradient-earn text-earn-foreground gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" /> Add Friend
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Edit className="h-3.5 w-3.5" /> Edit Profile
                </Button>
              </div>
            </div>

            {/* Bio */}
            {currentUser.bio && (
              <p className="text-sm mt-4">{currentUser.bio}</p>
            )}

            {/* Info */}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
              {currentUser.work && (
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {currentUser.work}
                </span>
              )}
              {currentUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {currentUser.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Joined {new Date(currentUser.joinedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {currentUser.friendsCount.toLocaleString()} friends · {currentUser.followersCount.toLocaleString()} followers
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="posts">
          <TabsList className="w-full justify-start bg-card border">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="friends">Friends</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          <TabsContent value="posts" className="mt-4 space-y-4">
            {userPosts.length > 0 ? (
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No posts yet. Share something to start earning!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="about" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">About section coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="friends" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Friends list coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="photos" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Photo gallery coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
