"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface LikeComponentProps {
  initialLikes: number;
  tweetId: string;
  userId: string;
}

export const LikeComponent: React.FC<LikeComponentProps> = ({ 
  initialLikes, 
  tweetId, 
  userId 
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial like status when component mounts
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/tweet_likeing`, {
          params: { tweetId }
        });
        
        setIsLiked(response.data.isLiked);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch like status', error);
        setIsLoading(false);
      }
    };

    checkLikeStatus();
  }, [tweetId, userId]);

  const handleLike = async () => {
    try {
      // Prevent multiple simultaneous interactions
      if (isAnimating || isLoading) return;

      setIsAnimating(true);

      // Toggle like state
      const newLikedState = !isLiked;
      
      // Optimistic update
      setIsLiked(newLikedState);
      setLikes(newLikedState ? likes + 1 : likes - 1);

      // Backend call to handle like
      await axios.post('/api/tweet_likeing', { 
        tweetId, 
        userId 
      });

      // Reset animation state
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);

    } catch (error) {
      // Revert optimistic update on error
      setIsLiked(isLiked);
      setLikes(initialLikes);
      console.error('Like toggle failed', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <motion.div
        key="like-button"
        initial={{ scale: 1 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 10 
        }}
      >
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleLike}
          disabled={isAnimating || isLoading}
          className="relative"
        >
          {isLoading ? (
            <div className="animate-pulse">
              <Heart 
                className="text-gray-300" 
                size={24} 
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {isLiked ? (
                <motion.div
                  key="liked"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart 
                    className="text-rose-500" 
                    fill="currentColor" 
                    size={24} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="not-liked"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Heart 
                    className="text-gray-400 hover:text-rose-300" 
                    size={24} 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </Button>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.span
          key={`${likes}-${isLoading}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={`text-sm font-medium ${isLoading ? "text-gray-300" : "text-gray-600"}`}
        >
          {likes}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};