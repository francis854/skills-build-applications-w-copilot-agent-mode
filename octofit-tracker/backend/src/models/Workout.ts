import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  description: string;
  activityType: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  caloriesEstimate: number;
  pointsEstimate: number;
  instructions: string[];
  equipment?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
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
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  caloriesEstimate: {
    type: Number,
    required: true,
    min: 0,
  },
  pointsEstimate: {
    type: Number,
    required: true,
    min: 0,
  },
  instructions: {
    type: [String],
    default: [],
  },
  equipment: {
    type: [String],
    default: [],
  },
}, {
  timestamps: true,
});

WorkoutSchema.index({ difficulty: 1, activityType: 1 });

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);
