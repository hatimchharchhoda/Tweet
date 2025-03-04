"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Tweet {
  _id: string;
  tweet: string;
  user: { username: string };
  date: string;
  likes: number;
}

export default function MyTweets() {
  const { data: session } = useSession();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [newTweet, setNewTweet] = useState("");

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

    try {
      await axios.post("/api/tweet_send", { user: session?.user?.username, tweet: newTweet });
      setNewTweet("");
      fetchTweets(); // Refresh tweets after posting
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Tweets</h1>

      {/* New Tweet Input */}
      <div className="flex items-start space-x-3 mb-6 p-4 border rounded-lg shadow">
        {/* Profile Icon */}
        <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
          {session?.user?.username?.slice(0, 2).toUpperCase()}
        </div>

        {/* Text Input */}
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          rows={2}
          placeholder="What's on your mind?"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
        />

        {/* Post Button */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handlePostTweet}
        >
          Tweet
        </button>
      </div>

      {/* Tweet List */}
      <div className="space-y-4">
        {tweets.length === 0 ? (
          <p className="text-gray-500 text-center">No tweets yet.</p>
        ) : (
          tweets.map((tweet) => (
            <div key={tweet._id} className="p-4 border rounded-lg shadow flex space-x-3">
              {/* Profile Icon */}
              <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold text-lg">
                {tweet.user.username.slice(0, 2).toUpperCase()}
              </div>

              {/* Tweet Content */}
              <div className="flex-1">
                <p className="font-bold">@{tweet.user.username}</p>
                <p className="text-gray-800">{tweet.tweet}</p>
                <div className="text-sm text-gray-500 mt-2 flex justify-between">
                  <span>{new Date(tweet.date).toLocaleString()}</span>
                  <span>❤️ {tweet.likes}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
