"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Loader2, Flame, MessageCircle, BarChart2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LikeComponent } from "@/components/Likes";
import { CommentsSection } from "@/components/CommentSection";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Tweet {
  _id: string;
  tweet: string;
  user: { username: string };
  date: string;
  likes: number;
  commentCount?: number;
  engagementScore?: number;
  topics?: string[];
}

export default function TrendingPage() {
  const { data: session } = useSession();

  const [activeTab, setActiveTab] = useState<"likes" | "comments" | "engagement">("likes");

  const [likedTweets, setLikedTweets] = useState<Tweet[]>([]);
  const [commentedTweets, setCommentedTweets] = useState<Tweet[]>([]);
  const [engagingTweets, setEngagingTweets] = useState<Tweet[]>([]);

  const [loadingLikes, setLoadingLikes] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingEngagement, setLoadingEngagement] = useState(false);

  // Fetch top liked tweets
  async function fetchLikedTweets() {
    setLoadingLikes(true);
    try {
      const response = await axios.get("/api/trending/likes");
      if (response.data?.tweets && Array.isArray(response.data.tweets)) {
        setLikedTweets(response.data.tweets);
      } else {
        setLikedTweets([]);
        toast({
          title: "Warning",
          description: "Unexpected response from likes API.",
          variant: "destructive",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to load liked tweets.",
        variant: "destructive",
      });
      setLikedTweets([]);
    } finally {
      setLoadingLikes(false);
    }
  }

  // Fetch top commented tweets
  async function fetchCommentedTweets() {
    setLoadingComments(true);
    try {
      const response = await axios.get("/api/trending/comments");
      if (response.data?.tweets && Array.isArray(response.data.tweets)) {
        setCommentedTweets(response.data.tweets);
      } else {
        setCommentedTweets([]);
        toast({
          title: "Warning",
          description: "Unexpected response from comments API.",
          variant: "destructive",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to load commented tweets.",
        variant: "destructive",
      });
      setCommentedTweets([]);
    } finally {
      setLoadingComments(false);
    }
  }

  // Fetch top engaging tweets
  async function fetchEngagingTweets() {
    setLoadingEngagement(true);
    try {
      const response = await axios.get("/api/trending/engagement");
      if (response.data?.tweets && Array.isArray(response.data.tweets)) {
        setEngagingTweets(response.data.tweets);
      } else {
        setEngagingTweets([]);
        toast({
          title: "Warning",
          description: "Unexpected response from engagement API.",
          variant: "destructive",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to load engaging tweets.",
        variant: "destructive",
      });
      setEngagingTweets([]);
    } finally {
      setLoadingEngagement(false);
    }
  }

  // Run appropriate fetch on tab change
  useEffect(() => {
    if (activeTab === "likes") fetchLikedTweets();
    else if (activeTab === "comments") fetchCommentedTweets();
    else if (activeTab === "engagement") fetchEngagingTweets();
  }, [activeTab]);

  // Loading & content switch helper
  const isLoading = () => {
    if (activeTab === "likes") return loadingLikes;
    if (activeTab === "comments") return loadingComments;
    if (activeTab === "engagement") return loadingEngagement;
  };

  const getContent = (): Tweet[] => {
  if (activeTab === "likes") return likedTweets;
  if (activeTab === "comments") return commentedTweets;
  if (activeTab === "engagement") return engagingTweets;
  return []; // fallback to empty array
};


  const renderTweetItem = (tweet: Tweet) => (
    <div key={tweet._id} className="p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-3">
        <div className="h-12 w-12 bg-primary text-white rounded-full flex items-center justify-center font-bold">
          {tweet.user?.username?.slice(0, 2).toUpperCase() || "NA"}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <p className="font-semibold">@{tweet.user?.username || "unknown"}</p>
            <span className="text-xs text-muted-foreground">
              {tweet.date ? new Date(tweet.date).toLocaleString() : "Unknown date"}
            </span>
          </div>
          <p className="mt-1 text-sm">{tweet.tweet}</p>
          {tweet.topics && tweet.topics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tweet.topics.map((topic, idx) => (
                <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm text-muted-foreground gap-6 mt-2">
        <LikeComponent
          initialLikes={tweet.likes}
          tweetId={tweet._id}
          userId={session?.user?.id || ""}
        />
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{tweet.commentCount ?? 0}</span>
        </div>
        {tweet.engagementScore !== undefined && (
          <div className="flex items-center gap-1">
            <BarChart2 className="h-4 w-4" />
            <span>{tweet.engagementScore.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t pt-3">
        <CommentsSection tweetId={tweet._id} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full relative">
      <AnimatedBackground />
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
          <Tabs value={activeTab}
            defaultValue="likes"
            onValueChange={(value: string) => setActiveTab(value as "likes" | "comments" | "engagement")}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="likes" className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> Liked
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" /> Discussed
              </TabsTrigger>
              <TabsTrigger value="engagement" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" /> Engaging
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading() ? (
                <div className="flex flex-col justify-center items-center h-60">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-primary font-medium">Loading...</p>
                </div>
              ) : getContent().length === 0 ? (
                <div className="flex justify-center items-center h-60 text-muted-foreground">
                  No content available.
                </div>
              ) : (
                <div className="space-y-4">
                  {getContent().map(renderTweetItem)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}