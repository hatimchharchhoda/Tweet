import mongoose,{Schema} from 'mongoose';

export interface comments extends Document{
  user : mongoose.Schema.Types.ObjectId,
  tweet : mongoose.Schema.Types.ObjectId,
  comment : string,
  date : Date,
}
const comments_model = new mongoose.Schema({
   user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Fix here
   tweet : { type: Schema.Types.ObjectId, ref: 'Tweet', required: true },
   comment : { type: String },
   date : { type: Date, default: Date.now },
 });

export const Comments = 
   mongoose.models.Comment || mongoose.model<comments>('Comment', comments_model);