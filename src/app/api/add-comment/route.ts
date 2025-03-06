import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/dbConnect";
import { Tweets } from "@/models/tweetModel";
import { Comments } from "@/models/commentModel";
import UserModel from "@/models/model";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await connectDB(); // Ensure database connection

  try {
    // Get the user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { tweetId, comment } = body;

    // Validate inputs
    if (!tweetId || !comment.trim()) {
      return NextResponse.json(
        { error: "Tweet ID and comment are required" },
        { status: 400 }
      );
    }

    // Find the user (ensure it exists)
    const user = await UserModel.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 1. First, check if the tweet exists
    const tweet = await Tweets.findById(tweetId);
    if (!tweet) {
      return NextResponse.json({ error: "Tweet not found" }, { status: 404 });
    }

    // 2. Create the new comment in Comments collection
    const newComment = await Comments.create({
      user: user._id,
      tweet: tweetId,
      comment: comment,
      date: new Date()
    });

    // 3. Populate the user information in the new comment
    await newComment.populate('user', 'username');

    // 4. Increment the comments count in the Tweet model
    await Tweets.findByIdAndUpdate(
      tweetId,
      { $inc: { comments: 1 } }
    );

    // Return the newly created comment
    return NextResponse.json(
      {
        message: "Comment added successfully",
        comment: newComment
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}