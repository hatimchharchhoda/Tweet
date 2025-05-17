import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Tweets } from '@/models/tweetModel';

export async function GET() {
  try {
    await dbConnect();

    const tweets = await Tweets.find()
      .sort({ likes: -1, date: -1 })
      .limit(10)
      .populate('user', 'username')
      .lean();

    const formattedTweets = tweets.map(tweet => ({
      _id: tweet._id,
      tweet: tweet.tweet,
      user: {
        username: tweet.user.username,
      },
      date: tweet.date,
      likes: tweet.likes,
      commentCount: tweet.comments,
    }));

    return NextResponse.json({ tweets: formattedTweets });
  } catch (error) {
    console.error('Error fetching trending likes:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}