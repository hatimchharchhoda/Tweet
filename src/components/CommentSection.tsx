"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Comment {
  _id: string;
  user: { username: string; _id: string };
  tweet: string;
  comment: string;
  date: string;
}

interface CommentsSectionProps {
  tweetId: string;
  initialComments?: Comment[];
  onCommentAdded?: (comment: Comment) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  tweetId,
  initialComments = [],
  onCommentAdded,
}) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/load-comments/${tweetId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isCommentsExpanded && comments.length === 0 && !isLoading) {
      loadComments();
    }
  }, [isCommentsExpanded]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !session?.user) return;

    try {
      setIsCommenting(true);
      const response = await axios.post('/api/add-comment', {
        tweetId,
        comment: newComment,
      });

      const addedComment = response.data.comment;

      setComments((prev) => [...prev, addedComment]);

      if (onCommentAdded) {
        onCommentAdded(addedComment);
      }

      setNewComment('');
      setIsCommentsExpanded(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const toggleComments = () => {
    setIsCommentsExpanded((prev) => !prev);
  };

  return (
    <div className="mt-4 space-y-3">
      {/* Input */}
      <div className="flex items-center gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <Button
          onClick={handleAddComment}
          disabled={isCommenting}
          size="icon"
          variant="ghost"
          className="text-gray-600 hover:text-primary"
        >
          <Send size={16} />
        </Button>
      </div>

      {/* Toggle */}
      <motion.div
        onClick={toggleComments}
        className="flex items-center justify-between text-sm px-3 py-2 rounded-xl cursor-pointer bg-muted hover:bg-muted/60 transition-colors border border-border"
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <MessageCircle size={16} />
          <span>
            {comments.length > 0
              ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}`
              : 'Comments'}
          </span>
        </div>
        {isCommentsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </motion.div>

      {/* Comments */}
      <AnimatePresence initial={false}>
        {isCommentsExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-2"
          >
            {isLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-3 text-gray-500 text-sm italic animate-pulse"
              >
                Loading comments...
              </motion.div>
            ) : comments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-3 text-gray-400 text-sm italic"
              >
                No comments yet. Be the first to comment!
              </motion.div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3 rounded-2xl bg-white border border-border shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-primary">
                      @{comment.user.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.date).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-gray-700">{comment.comment}</p>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};