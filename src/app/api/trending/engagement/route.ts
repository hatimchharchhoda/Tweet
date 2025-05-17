import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Tweets } from "@/models/tweetModel";

export async function GET() {
  try {
    await dbConnect();

    // Get current time once for all docs
    const now = new Date();

    const tweets = await Tweets.aggregate([
      {
        $addFields: {
          hoursSincePosted: {
            $divide: [
              { $subtract: [now, "$date"] }, 
              1000 * 60 * 60 // milliseconds to hours
            ]
          }
        }
      },
      {
        $addFields: {
          engagementScore: {
            $divide: [
              { $add: [
                  { $multiply: ["$likes", 0.6] },
                  { $multiply: ["$comments", 0.4] }
                ]
              },
              { $add: ["$hoursSincePosted", 1] }
            ]
          }
        }
      },
      { $sort: { engagementScore: -1, date: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          tweet: 1,
          likes: 1,
          comments: 1,
          date: 1,
          engagementScore: 1,
          "user.username": 1
        }
      }
    ]);

    const formattedTweets = tweets.map(tweet => ({
      _id: tweet._id,
      tweet: tweet.tweet,
      user: { username: tweet.user.username },
      date: tweet.date,
      likes: tweet.likes,
      commentCount: tweet.comments,
      engagementScore: tweet.engagementScore,
    }));

    return NextResponse.json({ tweets: formattedTweets });
  } catch (error) {
    console.error("Error fetching trending engagement:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}