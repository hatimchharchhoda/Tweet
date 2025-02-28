import mongoose,{Schema} from 'mongoose';

export interface Usertype extends Document {
  username: string,
  email: string,
  password: string
}
const UserSchema: Schema<Usertype> = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
  });

const UserModel =
  (mongoose.models.User as mongoose.Model<Usertype>) ||
  mongoose.model<Usertype>('User', UserSchema);

export default UserModel;


