import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { Comments } from "@/models/commentModel";

export async function GET(
  req: NextRequest,
  { params }: { params: { tweetId: string } }
) {
  await connectDB();

  try {
    const { tweetId } = params;

    if (!tweetId) {
      return NextResponse.json(
        { error: "Tweet ID is required" },
        { status: 400 }
      );
    }

    // Find all comments for this tweet, populate user details
    const comments = await Comments.find({ tweet: tweetId })
      .populate('user', 'username')
      .sort({ date: -1 }); // Most recent first

    return NextResponse.json(
      {
        comments
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}