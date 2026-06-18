import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  activityType: string;
  duration: number;
  distance?: number;
  calories: number;
  points: number;
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  activityType: {
    type: String,
    required: true,
    enum: ['running', 'cycling', 'swimming', 'walking', 'gym', 'yoga', 'sports', 'other'],
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  distance: {
    type: Number,
    min: 0,
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  notes: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IActivity>('Activity', ActivitySchema);
