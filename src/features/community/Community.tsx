"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, MessageCircle, Users, Plus, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { postCommunityTimelineAction } from "@/features/community/actions";


type Post = {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  likes_count?: number;
};

export default function Community() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setCurrentUser(user);

      // Fetch posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("id, body, created_at, author_id, likes_count")
        .order("created_at", { ascending: false })
        .limit(20);

      if (postsData) {
        setPosts(postsData);
      }

      setLoading(false);
    };
    checkAuth();

    // Setup realtime subscription for posts
    const postsChannel = supabase
      .channel('posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        async (payload) => {
          // Refetch posts
          const { data: postsData } = await supabase
            .from("posts")
            .select("id, body, created_at, author_id, likes_count")
            .order("created_at", { ascending: false })
            .limit(20);

          if (postsData) {
            setPosts(postsData);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [router]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !currentUser || posting) return;

    setPosting(true);
    try {
      await postCommunityTimelineAction(newPost.trim());

      setNewPost("");
      toast({
        title: "تم النشر!",
        description: "تم نشر منشورك بنجاح",
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "فشل في نشر المنشور",
      });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push("/app/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Community</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Create Post Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Textarea
              placeholder="شارك إنجازاتك الرياضية..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleCreatePost} 
                disabled={!newPost.trim() || posting}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                نشر
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="for-you" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="for-you">For You</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="for-you" className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No posts yet</p>
                  <p className="text-sm">Be the first to share your fitness journey!</p>
                </CardContent>
              </Card>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="font-semibold text-sm">
                          {post.author_id.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">Fitness Enthusiast</p>
                        <p className="text-sm mb-3">{post.body}</p>
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes_count || 0}</span>
                          </button>
                          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>0</span>
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(post.created_at).toLocaleDateString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="groups">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <p>Join groups to connect with like-minded fitness enthusiasts</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenges">
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                <p>Participate in fitness challenges to stay motivated</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
