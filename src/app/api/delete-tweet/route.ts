import { Tweets } from '@/models/tweetModel';
import { Comments } from '@/models/commentModel';
import { Likes } from '@/models/likesModel';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';


// Delete a tweet and all associated data (comments and likes)
export async function DELETE(req: NextRequest) {
  try {
    // Get the authenticated user from the session
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the user ID from the session
    const userId = session.user.id;
    
    // Get tweet ID from the request
    const { tweetId } = await req.json();
    
    if (!tweetId) {
      return NextResponse.json({ error: "Tweet ID is required" }, { status: 400 });
    }
    
    // Check if the tweet exists and belongs to the user
    const tweet = await Tweets.findOne({
      _id: tweetId,
      user: userId
    });
    
    if (!tweet) {
      return NextResponse.json({ 
        error: "Tweet not found or you don't have permission to delete it" 
      }, { status: 404 });
    }
    
    // Start a MongoDB session for transaction
    const session_db = await mongoose.startSession();
    session_db.startTransaction();
    
    try {
      // Delete all comments associated with the tweet
      await Comments.deleteMany({ tweet: tweetId }, { session: session_db });
      
      // Delete all likes associated with the tweet
      await Likes.deleteMany({ tweet: tweetId }, { session: session_db });
      
      // Delete the tweet itself
      await Tweets.findByIdAndDelete(tweetId, { session: session_db });
      
      // Commit the transaction
      await session_db.commitTransaction();
      session_db.endSession();
      
      return NextResponse.json({ 
        success: true, 
        message: "Tweet and associated data deleted successfully" 
      }, {status: 200});
      
    } catch (error) {
      // If anything fails, abort the transaction
      await session_db.abortTransaction();
      session_db.endSession();
      
      console.error("Transaction error:", error);
      
      return NextResponse.json({ 
        error: "Failed to delete tweet", 
        details: error instanceof Error ? error.message : String(error)
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Delete tweet error:", error);
    
    return NextResponse.json({ 
      error: "Server error", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
