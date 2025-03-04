import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/model";
import { Tweets } from "@/models/tweetModel";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const url = new URL(req.url);
        const username = url.searchParams.get("user");
        const user = await UserModel.findOne({ username }).select("_id"); // Fetch user ID
        
        if (!username) {
            return NextResponse.json({ success: false, error: "Username required" }, { status: 400 });
        }

        const tweets = await Tweets.find({ user: user?._id }).populate("user", "username").sort({ date: -1 });

        return NextResponse.json(tweets, { status: 200 });
    } catch (error) {
        console.error("Error fetching tweets:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch tweets" }, { status: 500 });
    }
}
