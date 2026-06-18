import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
  captain: mongoose.Types.ObjectId;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  captain: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model<ITeam>('Team', TeamSchema);
