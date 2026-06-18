import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  teamId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  goals: {
    type: [String],
    default: [],
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
