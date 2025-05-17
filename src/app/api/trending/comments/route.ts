import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Tweets } from '@/models/tweetModel';

interface FormattedTweet {
  _id: string;
  tweet: string;
  user: {
    _id: string;
    username: string;
  };
  date: Date;
  likes: number;
  commentCount: number;
  topics?: string[];
}

export async function GET() {
  try {
    await dbConnect();

    // Fetch top 10 most commented tweets, sorted by comment count (descending) 
    // and date (descending) for tie-breaker
    const mostCommentedTweets = await Tweets.find()
      .sort({ 
        comments: -1, // Sort by comment count descending
        date: -1      // Then by date descending for tie-breaker
      })
      .limit(10)
      .populate('user', 'username') // Only populate username from user
      .lean(); // Convert to plain JS object

    // Format for frontend
    const formattedTweets: FormattedTweet[] = mostCommentedTweets.map(tweet => ({
      _id: tweet._id as string,
      tweet: tweet.tweet,
      user: {
        _id: tweet.user._id.toString(),
        username: tweet.user.username
      },
      date: tweet.date,
      likes: tweet.likes,
      commentCount: tweet.comments, // Using the stored comment count
    }));

    return NextResponse.json({
      tweets: formattedTweets
    });

  } catch (error) {
    console.error('Failed to fetch most commented tweets:', error);
    return NextResponse.json(
      { message: 'Failed to fetch most commented tweets' },
      { status: 500 }
    );
  }
}