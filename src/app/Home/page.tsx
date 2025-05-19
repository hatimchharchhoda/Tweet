"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { LikeComponent } from "@/components/Likes";
import { CommentsSection } from "@/components/CommentSection";
import { toast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";
import { AIChatBot } from "@/components/AIChatBot";

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

export default function HomePage() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const lastTweetRef = useRef<HTMLDivElement | null>(null);

  const TWEETS_PER_PAGE = 15;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);

  const fetchTweets = useCallback(async (pageNum: number) => {
    if (loading && !refreshing) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/home-tweets?page=${pageNum}&limit=${TWEETS_PER_PAGE}`);
      const newTweets = response.data.tweets;

      if (newTweets.length < TWEETS_PER_PAGE) {
        setHasMore(false);
      }

      if (pageNum === 1) {
        setTweets(newTweets);
      } else {
        const existingIds = new Set(tweets.map(tweet => tweet._id));
        const uniqueNewTweets = newTweets.filter((tweet: { _id: string }) => !existingIds.has(tweet._id));
        setTweets(prev => [...prev, ...uniqueNewTweets]);
      }

      setInitialLoad(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      toast({
        title: "Error",
        description: "Failed to load tweets",
        variant: "destructive",
      });
      setRefreshing(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [loading, tweets, refreshing]);

  useEffect(() => {
    if (loading || !hasMore) return;

    const currentRef = lastTweetRef.current;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0, rootMargin: "100px" }
    );

    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    // ✅ Always return a cleanup function
    return () => {
      if (currentRef) {
        observerRef.current?.unobserve(currentRef);
      }
    };
  }, [hasMore, loading]);

  useEffect(() => {
    fetchTweets(1);
  }, []);

  useEffect(() => {
    if (page > 1 && hasMore) fetchTweets(page);
  }, [page, fetchTweets]);

  const handleCommentAdded = (tweetId: string, comment: Comment) => {
    setTweets(prevTweets =>
      prevTweets.map(tweet =>
        tweet._id === tweetId
          ? { ...tweet, comments: [...(tweet.comments || []), comment] }
          : tweet
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="flex h-screen w-full relative">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col h-full">
        <div className="flex-1 px-4 py-6">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {initialLoad ? (
              <div className="flex flex-col justify-center items-center h-64">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="h-12 w-12 text-primary" />  
                </motion.div>
                <p className="mt-4 text-primary font-medium">Loading...</p>
              </div>
            ) : tweets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 p-8 rounded-lg shadow flex flex-col items-center"
              >
                <p className="text-xl font-semibold">No tweets yet.</p>
                <p className="text-muted-foreground">Start the conversation!</p>
              </motion.div>
            ) : (
              tweets.map((tweet, index) => {
                const isLast = index === tweets.length - 1;
                return (
                  <motion.div
                    key={tweet._id}
                    ref={isLast && hasMore ? lastTweetRef : null}
                    variants={itemVariants}
                    layout
                    className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-gray-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                        {tweet.user.username.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-primary">@{tweet.user.username}</p>
                        <p className="text-gray-800 mt-1 text-sm md:text-base">{tweet.tweet}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between items-center text-muted-foreground text-sm">
                      <div className="flex space-x-4 items-center">
                        <LikeComponent
                          initialLikes={tweet.likes || 0}
                          tweetId={tweet._id}
                          userId={session?.user?.id || ''}
                        />
                      </div>
                      <span className="text-xs">{new Date(tweet.date).toLocaleString()}</span>
                    </div>

                    <div className="w-full pt-3 mt-3 border-t border-gray-100">
                      <CommentsSection tweetId={tweet._id} onCommentAdded={(comment) => handleCommentAdded(tweet._id, comment)} />
                    </div>
                  </motion.div>
                );
              })
            )}

            {loading && hasMore && !initialLoad && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}

            {!hasMore && tweets.length > 0 && (
              <p className="text-center text-muted-foreground text-sm italic py-6">You&apos;ve reached the end</p>
            )}
          </motion.div>
        </div>
      </div>

      <AIChatBot />
    </div>
  );
}