"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, User } from "lucide-react";
import { motion } from "framer-motion";
import { LikeComponent } from "@/components/Likes";
import { CommentsSection } from "@/components/CommentSection";
import DeleteTweet from "@/components/DeleteTweet";
import { toast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";

interface Comment {
  _id: string;
  user: { username: string };
  comment: string;
  date: string;
}

interface Tweet {
  _id: string;
  tweet: string;
  user: { username: string };
  date: string;
  likes: number;
  comments?: Comment[];
}

export default function MyTweets() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState("");
  const [tweeted, setTweeted] = useState(false);

  useEffect(() => {
    if (session?.user?.username) {
      fetchTweets();
    }
  }, [session]);

  const fetchTweets = async () => {
    try {
      const response = await axios.get(`/api/my-tweets?user=${session?.user?.username}`);
      setTweets(response.data.sort((a: Tweet, b: Tweet) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Error fetching tweets:", error);
    }
  };

  const handlePostTweet = async () => {
    if (!newTweet.trim()) return;
    setTweeted(true);
    try {
      await axios.post("/api/tweet_send", { user: session?.user?.username, tweet: newTweet });
      setNewTweet("");
      fetchTweets(); // Refresh tweets after posting
      setTweeted(false);
      toast({
        title: "Success",
        description: "New tweet posted",
        variant: "default",
      });
    } catch (error) {
      console.error("Error posting tweet:", error);
      toast({
        title: "Error",
        description: "Error posting tweet",
        variant: "destructive",
      });
    }
  };

  const handleCommentAdded = (tweetId: string, comment: Comment) => {
    setTweets(prevTweets => 
      prevTweets.map(tweet => 
        tweet._id === tweetId 
          ? { ...tweet, comments: [...(tweet.comments || []), comment] }
          : tweet
      )
    );
  };

  const handleTweetDeleted = (tweetId: string) => {
    setTweets((prev) => prev.filter((tweet) => tweet._id !== tweetId));
  };

  return (
    <div className="flex h-screen w-full ">
      <AnimatedBackground/>
      <div className="w-full max-w-4xl mx-auto flex flex-col h-full">
        {/* Header */}
        <div className="py-4 px-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <User className="text-primary" /> My Tweets
          </h1>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tweet Composition Area */}
          <div className="w-1/3 border-r border-gray-200 bg-white/60 backdrop-blur-sm p-4 flex flex-col overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 flex flex-col flex-1"
            >
              <h2 className="text-xl font-semibold mb-4">Compose Tweet</h2>
              <Textarea
                className="w-full h-40 focus:ring-2 focus:ring-primary/50 mb-4"
                placeholder="What's on your mind?"
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
              />
              <Button 
                onClick={handlePostTweet}
                className="w-full bg-primary hover:bg-primary/90 flex items-center justify-center gap-2"
                disabled={tweeted}
              >
                {tweeted ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tweeting
                  </>
                ) : (
                  <><Send size={16} /> Tweet</>
                )}
              </Button>
            </motion.div>
          </div>

          {/* Tweet List Area */}
          <div className="w-2/3 overflow-y-auto p-4 space-y-4">
            {tweets.length === 0 ? (
              <p className="text-muted-foreground text-center">No tweets yet.</p>
            ) : (
              tweets.map((tweet) => (
                <motion.div 
                  key={tweet._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 flex flex-col"
                >
                  {/* Profile Icon and Tweet Content */}
                  <div className="flex space-x-3 mb-3">
                    <div className="h-10 w-10 bg-primary text-white flex items-center justify-center rounded-full font-bold text-lg">
                      {tweet.user.username.slice(0, 2).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold text-primary">@{tweet.user.username}</p>
                      <p className="text-foreground">{tweet.tweet}</p>
                    </div>
                    <DeleteTweet 
                      tweetId={tweet._id} 
                      onDelete={() => handleTweetDeleted(tweet._id)}
                    />
                  </div> 

                  {/* Date and Interaction Buttons */}
                  <div className="text-sm text-muted-foreground mt-2 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <LikeComponent 
                        initialLikes={tweet.likes || 0} 
                        tweetId={tweet._id} 
                        userId={session?.user?.id || ''} 
                      />
                    </div>
                    <span>{new Date(tweet.date).toLocaleString()}</span>
                  </div>
                  {/* Comments Section */}
                  <div className="w-full border-t border-gray-200 pt-3">
                    <CommentsSection 
                      tweetId={tweet._id}
                      onCommentAdded={(comment) => handleCommentAdded(tweet._id, comment)}
                    />
                  </div>
                  </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}