import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/dbConnect';
import mongoose from 'mongoose';
import { Likes } from '@/models/likesModel';
import UserModel from '@/models/model';
import { Tweets } from '@/models/tweetModel';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  // Ensure database connection
  await connectDB();

  try {
    // Get server-side session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Parse request body
    const { tweetId } = await req.json();

    // Validate tweet ID
    if (!tweetId) {
      return NextResponse.json({ error: 'Tweet ID is required' }, { status: 400 });
    }

    // Find the user and tweet to ensure they exist
    const user = await UserModel.findById(session.user.id);
    const tweet = await Tweets.findById(tweetId);

    if (!user || !tweet) {
      return NextResponse.json({ error: 'User or Tweet not found' }, { status: 404 });
    }

    // Check if like already exists
    const existingLike = await Likes.findOne({ 
      user: user._id, 
      tweet: tweetId 
    });
    
    if (existingLike) {
      // Toggle like using direct MongoDB update to ensure only liked field is modified
      const updatedLike = await Likes.findByIdAndUpdate(
        existingLike._id,
        [{ $set: { liked: { $not: "$liked" } } }], // MongoDB update with aggregation to toggle boolean
        { new: true } // Return the updated document
      );

      // Update tweet likes count
      await Tweets.findByIdAndUpdate(tweetId, {
        $inc: { likes: updatedLike.liked ? 1 : -1 }
      });

      return NextResponse.json({
        message: updatedLike.liked ? 'Liked' : 'Unliked',
        liked: updatedLike.liked
      });
    } else {
      // Create new like using direct MongoDB insert to control exactly what's saved
      const likeDoc = await Likes.collection.insertOne({
        user: new mongoose.Types.ObjectId(user._id),
        tweet: new mongoose.Types.ObjectId(tweetId),
        liked: true
      });
      
      // Get the inserted document
      const newLike = await Likes.findById(likeDoc.insertedId);
      console.log(newLike);
      
      // Update tweet likes count
      await Tweets.findByIdAndUpdate(tweetId, {
        $inc: { likes: 1 }
      });

      return NextResponse.json({
        message: 'Liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Like handler error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Ensure database connection
  await connectDB();

  try {
    // Get server-side session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the tweetId from URL parameters
    const url = new URL(req.url);
    const tweetId = url.searchParams.get('tweetId');

    // Validate tweet ID
    if (!tweetId) {
      return NextResponse.json({ error: 'Tweet ID is required' }, { status: 400 });
    }

    // Find the user and tweet to ensure they exist
    const user = await UserModel.findById(session.user.id);
    const tweet = await Tweets.findById(tweetId);

    if (!user || !tweet) {
      return NextResponse.json({ error: 'User or Tweet not found' }, { status: 404 });
    }

    // Check if like already exists and is active
    const existingLike = await Likes.findOne({ 
      user: user._id, 
      tweet: tweetId 
    });
    
    return NextResponse.json({
      isLiked: existingLike ? existingLike.liked : false,
      likeCount: tweet.likes || 0
    });
    
  } catch (error) {
    console.error('Like status check error:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}