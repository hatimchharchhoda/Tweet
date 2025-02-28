import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/model';
import { Tweets } from '@/models/tweetModel';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        // Connect to the database
        await dbConnect();

        const { user, tweet } = await request.json();

        // Fetch user from database
        const getuser = await UserModel.findOne({ username: user });
        if (!getuser) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        // Extract user ID
        const userId = getuser._id;

        // Create new tweet
        const newTweet = new Tweets({ user: userId, tweet });

        await newTweet.save();

        // Return a success response
        return NextResponse.json({ success: true, message: "New tweet created" }, { status: 200 });
    } catch (error) {
        console.error('Error creating tweet:', error);
        return NextResponse.json({ success: false, error: 'Failed to create tweet' }, { status: 400 });
    }
}
