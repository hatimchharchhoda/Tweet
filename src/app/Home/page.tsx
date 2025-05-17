"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {Loader2} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      loadingRef.current = false; // reset after fetch is done
    }
    
  }, [loading, tweets, refreshing]);

  // Fixed Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;
  
    const currentRef = lastTweetRef.current;
  
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
  
    observerRef.current = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && !loadingRef.current) {
          loadingRef.current = true;
          setPage(prev => prev + 1);
        }
      },
      { threshold: 1.0, rootMargin: "100px" }
    );
  
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }
  
    return () => {
      if (currentRef) {
        observerRef.current?.unobserve(currentRef);
      }
    };
  }, [hasMore, loading]);
  

  // Initial load
  useEffect(() => {
    fetchTweets(1);
  }, []);

  // Fetch on page change
  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchTweets(page);
    }
    return;
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
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="flex h-screen w-full relative">
      <AnimatedBackground />
      <div className="w-full max-w-5xl mx-auto flex flex-col h-full">

        <div className="flex-1 overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
          <div className="w-full p-4 space-y-4 pb-20">
            {initialLoad ? (
              <div className="flex flex-col justify-center items-center h-60">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="h-12 w-12 text-primary" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-primary font-medium"
                >
                  Loading tweets...
                </motion.p>
              </div>
            ) : tweets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-60 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm p-8"
              >
                <p className="text-xl text-gray-600 text-center">No tweets available.</p>
                <p className="text-muted-foreground text-center mt-2">Be the first to start the conversation!</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                <AnimatePresence>
                {tweets.map((tweet, index) => {
                  const isLastTweet = index === tweets.length - 1;

                  return (
                    <motion.div
                      key={tweet._id}
                      ref={isLastTweet && hasMore ? lastTweetRef : null}
                      variants={itemVariants}
                      layout
                      className="p-5 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:bg-white/80 flex flex-col w-full"
                    >
                        <div className="flex space-x-3 mb-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="h-12 w-12 bg-primary text-white flex items-center justify-center rounded-full font-bold text-lg shadow-sm"
                          >
                            {tweet.user.username.slice(0, 2).toUpperCase()}
                          </motion.div>

                          <div className="flex-1">
                            <p className="font-semibold text-primary">@{tweet.user.username}</p>
                            <p className="text-foreground mt-1 text-sm md:text-base">{tweet.tweet}</p>
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground mt-auto pt-3 flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <LikeComponent
                              initialLikes={tweet.likes || 0}
                              tweetId={tweet._id}
                              userId={session?.user?.id || ''}
                            />
                          </div>
                          <span className="text-xs md:text-sm">{new Date(tweet.date).toLocaleString()}</span>
                        </div>

                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="w-full border-t border-gray-200 pt-3 mt-3"
                        >
                          <CommentsSection
                            tweetId={tweet._id}
                            onCommentAdded={(comment) => handleCommentAdded(tweet._id, comment)}
                          />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {loading && hasMore && !initialLoad && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center py-8"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <p className="text-primary/70 mt-2">Loading more tweets...</p>
                </div>
              </motion.div>
            )}

            {!hasMore && tweets.length > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center text-muted-foreground py-6 italic"
              >
                You&apos;ve reached the end of your feed
              </motion.p>
            )}
          </div>
        </div>
      </div>
      <AIChatBot /> 
    </div>
  );
}