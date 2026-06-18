import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  teamId?: mongoose.Types.ObjectId;
  teamName?: string;
  totalPoints: number;
  totalActivities: number;
  totalDuration: number;
  totalCalories: number;
  rank: number;
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  periodStart: Date;
  periodEnd: Date;
  updatedAt: Date;
}

const LeaderboardSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  teamName: {
    type: String,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  totalActivities: {
    type: Number,
    default: 0,
  },
  totalDuration: {
    type: Number,
    default: 0,
  },
  totalCalories: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'alltime'],
    required: true,
  },
  periodStart: {
    type: Date,
    required: true,
  },
  periodEnd: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

LeaderboardSchema.index({ period: 1, totalPoints: -1 });
LeaderboardSchema.index({ userId: 1, period: 1 });

export default mongoose.model<ILeaderboardEntry>('Leaderboard', LeaderboardSchema);
