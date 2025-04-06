"use client";

import React, { useState } from "react";
import { MoreVertical, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

interface TweetActionsProps {
  tweetId: string;
  onDelete?: () => void;
}

const DeleteTweet: React.FC<TweetActionsProps> = ({ tweetId, onDelete }) => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleDelete = async () => {
    if (!session?.user) {
      console.error("❌ User not authenticated");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.delete("/api/delete-tweet", {
        data: { tweetId }, // `DELETE` requests require `data`
      });

      if (response.status === 200) {
        console.log("✅ Tweet deleted successfully");
        onDelete?.(); // Notify parent component to update UI
      }

      toast({
        title: "Success",
        description: "Tweet deleted successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("🚨 Error deleting tweet:", error);
      toast({
        title: "Failed",
        description: "Failed deleting tweet",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setConfirmDelete(false);
      setMenuOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Three-Dot Button */}
      <Button variant="ghost" size="icon" onClick={toggleMenu}>
        <MoreVertical size={16} />
      </Button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-2 w-32 z-10">
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 text-red-600 hover:bg-gray-100 p-2 rounded-md w-full text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 text-center">
            <p className="text-gray-800 font-semibold">Are you sure?</p>
            <p className="text-sm text-gray-600">
              This action cannot be undone.
            </p>

            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setConfirmDelete(false)}>
                <X size={14} /> Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : <><Check size={14} /> Delete</>}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteTweet;