"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from '@/lib/utils';
import axios from "axios";

interface LikeComponentProps {
  initialLikes: number;
  tweetId: string;
  userId: string;
}

export const LikeComponent: React.FC<LikeComponentProps> = ({
  initialLikes,
  tweetId,
  userId,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/tweet_likeing`, {
          params: { tweetId },
        });
        setIsLiked(response.data.isLiked);
      } catch (error) {
        console.error("Failed to fetch like status", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLikeStatus();
  }, [tweetId, userId]);

  const handleLike = async () => {
    if (isAnimating || isLoading) return;

    setIsAnimating(true);
    const newLikedState = !isLiked;

    // Optimistic update
    setIsLiked(newLikedState);
    setLikes((prev) => prev + (newLikedState ? 1 : -1));

    try {
      await axios.post("/api/tweet_likeing", {
        tweetId,
        userId,
      });
    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikes(initialLikes);
      console.error("Like toggle failed", error);
    } finally {
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.15 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        disabled={isAnimating || isLoading}
        onClick={handleLike}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
          isLiked ? "bg-rose-100 hover:bg-rose-200" : "bg-muted hover:bg-rose-100"
        )}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="animate-pulse text-gray-300"
            >
              <Heart size={20} />
            </motion.div>
          ) : isLiked ? (
            <motion.div
              key="liked"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Heart size={20} className="text-rose-500" fill="currentColor" />
            </motion.div>
          ) : (
            <motion.div
              key="not-liked"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Heart size={20} className="text-gray-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence mode="wait">
        <motion.span
          key={`${likes}-${isLoading}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "text-sm font-medium transition-colors",
            isLoading ? "text-gray-300" : "text-gray-600"
          )}
        >
          {likes}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};