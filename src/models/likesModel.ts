import mongoose,{Schema} from 'mongoose';

export interface likes extends Document{
  user : mongoose.Schema.Types.ObjectId,
  tweet : mongoose.Schema.Types.ObjectId,
  liked : boolean,
}
const likes_model = new mongoose.Schema({
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Fix here
   tweet : { type: Schema.Types.ObjectId, ref: 'Tweet', required: true },
   liked : { type: Boolean, default: false, required: true}
 },{ timestamps: true });

export const Likes = 
   mongoose.models.Like || mongoose.model<likes>('Like', likes_model);