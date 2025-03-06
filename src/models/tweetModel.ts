import mongoose,{Schema} from 'mongoose';

export interface tweets extends Document{
  tweet: string,
  user : mongoose.Schema.Types.ObjectId,
  date : Date,
  likes : number,
  comments : number
}
const tweets_model = new mongoose.Schema({
   tweet: { type: String, required: true }, // Fix here
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Fix here
   date: { type: Date, default: Date.now },
   likes: { type: Number, default: 0 },
   comments: { type: Number, default: 0 }
 });

export const Tweets = 
   mongoose.models.Tweet || mongoose.model<tweets>('Tweet', tweets_model);