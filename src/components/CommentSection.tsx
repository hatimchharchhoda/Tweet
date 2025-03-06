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
  onCommentAdded 
}) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load comments when needed
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

  // Load comments when expanded if none are loaded yet
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
        comment: newComment
      });

      const addedComment = response.data.comment;
      
      // Add the new comment to the comments array
      setComments(prev => [...prev, addedComment]);
      
      // Call the callback if provided
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
    setIsCommentsExpanded(!isCommentsExpanded);
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Comment Input */}
      <div className="flex items-center space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
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
          variant="outline"
        >
          <Send size={16} />
        </Button>
      </div>

      {/* Comments Overview and Toggle */}
      <div 
        onClick={toggleComments}
        className="flex items-center justify-between text-sm text-muted-foreground cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2">
          <MessageCircle size={16} />
          <span>{comments.length > 0 ? `${comments.length} Comment${comments.length !== 1 ? 's' : ''}` : 'Comments'}</span>
        </div>
        {isCommentsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {/* Comments List */}
      <AnimatePresence>
        {isCommentsExpanded && (
          <>
            {isLoading ? (
              <div className="text-center py-4 text-sm text-gray-500">Loading comments...</div>
            ) : (
              <>
                {comments.length === 0 ? (
                  <div className="text-center py-4 text-sm text-gray-500">No comments yet. Be the first to comment!</div>
                ) : (
                  comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-100 p-3 rounded-lg mb-2 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm text-primary">
                          @{comment.user.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.date).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.comment}</p>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};