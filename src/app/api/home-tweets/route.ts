// app/api/tweets/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import { Tweets } from "@/models/tweetModel";

export async function GET(req: NextRequest) {
  await connectDB();
  
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "15");
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Fetch tweets with pagination, sorted by date (newest first)
    const tweets = await Tweets.find({})
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username")
      .lean();
    
    // Count total tweets for pagination info
    const total = await Tweets.countDocuments({});
    
    return NextResponse.json({
      tweets,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweets" },
      { status: 500 }
    );
  }
}