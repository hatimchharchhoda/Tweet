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
import { AIChatBot } from "@/components/AIChatBot";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    if (session?.user?.username) fetchTweets();
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
      fetchTweets();
      setTweeted(false);
      toast({ title: "Success", description: "New tweet posted" });
    } catch (error) {
      console.error("Error posting tweet:", error);
      toast({ title: "Error", description: "Error posting tweet", variant: "destructive" });
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
    setTweets(prev => prev.filter(tweet => tweet._id !== tweetId));
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <AnimatedBackground />

      <div className="flex w-full h-full z-10 max-w-7xl mx-auto">
        {/* Sidebar Composer */}
        <div className="w-1/3 bg-white/80 border-r border-gray-200 p-6 backdrop-blur-md flex flex-col gap-6">
          <motion.h1
            className="text-2xl font-bold flex items-center gap-3 text-primary"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <User /> My Tweets
          </motion.h1>

          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Textarea
              placeholder="What's on your mind?"
              value={newTweet}
              onChange={(e) => setNewTweet(e.target.value)}
              className="min-h-[120px] resize-none"
            />
            <Button
              onClick={handlePostTweet}
              className="w-full flex gap-2 items-center justify-center"
              disabled={tweeted}
            >
              {tweeted ? <><Loader2 className="w-4 h-4 animate-spin" /> Tweeting</> : <><Send size={16} /> Tweet</>}
            </Button>
          </motion.div>
        </div>

        {/* Feed Section */}
        <ScrollArea className="w-2/3 p-6 overflow-y-auto">
          {tweets.length === 0 ? (
            <p className="text-muted-foreground text-center mt-20">No tweets yet.</p>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="space-y-4"
            >
              {tweets.map((tweet) => (
                <motion.div
                  key={tweet._id}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className="bg-white/80 rounded-xl p-4 shadow hover:shadow-md border border-gray-200 backdrop-blur"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                        {tweet.user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">@{tweet.user.username}</p>
                        <p className="text-sm md:text-base text-gray-800 mt-1">{tweet.tweet}</p>
                      </div>
                    </div>
                    <DeleteTweet tweetId={tweet._id} onDelete={() => handleTweetDeleted(tweet._id)} />
                  </div>

                  <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                    <LikeComponent
                      initialLikes={tweet.likes || 0}
                      tweetId={tweet._id}
                      userId={session?.user?.id || ''}
                    />
                    <span>{new Date(tweet.date).toLocaleString()}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-200 mt-3">
                    <CommentsSection
                      tweetId={tweet._id}
                      onCommentAdded={(comment) => handleCommentAdded(tweet._id, comment)}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </ScrollArea>
      </div>

      <AIChatBot />
    </div>
  );
}