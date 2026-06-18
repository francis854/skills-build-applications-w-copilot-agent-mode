import express, { Request, Response } from 'express';
import { Activity, User, Team } from '../models/index.js';

const router = express.Router();

// Get all activities
router.get('/', async (req: Request, res: Response) => {
  try {
    const { userId, activityType, startDate, endDate } = req.query;
    
    let query: any = {};
    
    if (userId) {
      query.userId = userId;
    }
    
    if (activityType) {
      query.activityType = activityType;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate as string);
      }
    }
    
    const activities = await Activity.find(query)
      .populate('userId', 'username email')
      .sort({ date: -1 });
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get activity by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate('userId', 'username email');
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Create new activity
router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, activityType, duration, distance, calories, points, notes, date } = req.body;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const activity = new Activity({
      userId,
      activityType,
      duration,
      distance,
      calories,
      points,
      notes,
      date: date || new Date(),
    });

    await activity.save();

    // Update team points if user is in a team
    if (user.teamId) {
      await Team.findByIdAndUpdate(user.teamId, {
        $inc: { totalPoints: points },
      });
    }

    const populatedActivity = await Activity.findById(activity._id)
      .populate('userId', 'username email');
    
    res.status(201).json(populatedActivity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Update activity
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { activityType, duration, distance, calories, points, notes, date } = req.body;
    
    const oldActivity = await Activity.findById(req.params.id);
    if (!oldActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const pointsDiff = points - oldActivity.points;

    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { activityType, duration, distance, calories, points, notes, date },
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    // Update team points if there's a difference
    if (pointsDiff !== 0) {
      const user = await User.findById(oldActivity.userId);
      if (user && user.teamId) {
        await Team.findByIdAndUpdate(user.teamId, {
          $inc: { totalPoints: pointsDiff },
        });
      }
    }

    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const activity = await Activity.findByIdAndDelete(req.params.id);
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Deduct points from team
    const user = await User.findById(activity.userId);
    if (user && user.teamId) {
      await Team.findByIdAndUpdate(user.teamId, {
        $inc: { totalPoints: -activity.points },
      });
    }

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// Get user statistics
router.get('/stats/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    
    const stats = await Activity.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalDistance: { $sum: '$distance' },
          totalCalories: { $sum: '$calories' },
          totalPoints: { $sum: '$points' },
        },
      },
    ]);

    if (stats.length === 0) {
      return res.json({
        totalActivities: 0,
        totalDuration: 0,
        totalDistance: 0,
        totalCalories: 0,
        totalPoints: 0,
      });
    }

    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;
