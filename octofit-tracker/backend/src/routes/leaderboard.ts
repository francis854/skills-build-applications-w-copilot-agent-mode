import express, { Request, Response } from 'express';
import { Activity, User, Team } from '../models/index.js';

const router = express.Router();

// Get leaderboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const { period = 'alltime', limit = 10 } = req.query;
    
    let dateFilter: any = {};
    const now = new Date();
    
    if (period === 'daily') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { date: { $gte: startOfDay } };
    } else if (period === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { date: { $gte: startOfWeek } };
    } else if (period === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { date: { $gte: startOfMonth } };
    }
    
    const leaderboard = await Activity.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
          totalActivities: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalCalories: { $sum: '$calories' },
        },
      },
      { $sort: { totalPoints: -1 } },
      { $limit: parseInt(limit as string) },
    ]);

    // Populate user details
    const populatedLeaderboard = await Promise.all(
      leaderboard.map(async (entry, index) => {
        const user = await User.findById(entry._id)
          .select('username email teamId')
          .populate('teamId', 'name');
        
        return {
          rank: index + 1,
          userId: entry._id,
          username: user?.username || 'Unknown',
          email: user?.email || '',
          team: user?.teamId || null,
          totalPoints: entry.totalPoints,
          totalActivities: entry.totalActivities,
          totalDuration: entry.totalDuration,
          totalCalories: entry.totalCalories,
        };
      })
    );

    res.json({
      period,
      leaderboard: populatedLeaderboard,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get team leaderboard
router.get('/teams', async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const teams = await Team.find()
      .sort({ totalPoints: -1 })
      .limit(parseInt(limit as string))
      .populate('captain', 'username email')
      .populate('members', 'username');

    const teamLeaderboard = teams.map((team, index) => ({
      rank: index + 1,
      teamId: team._id,
      name: team.name,
      captain: team.captain,
      memberCount: team.members.length,
      totalPoints: team.totalPoints,
    }));

    res.json({
      leaderboard: teamLeaderboard,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team leaderboard' });
  }
});

// Get user rank
router.get('/rank/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { period = 'alltime' } = req.query;
    
    let dateFilter: any = {};
    const now = new Date();
    
    if (period === 'daily') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateFilter = { date: { $gte: startOfDay } };
    } else if (period === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      dateFilter = { date: { $gte: startOfWeek } };
    } else if (period === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateFilter = { date: { $gte: startOfMonth } };
    }
    
    // Get user's total points
    const userStats = await Activity.aggregate([
      { $match: { ...dateFilter, userId } },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
        },
      },
    ]);

    if (userStats.length === 0) {
      return res.json({
        rank: 0,
        totalPoints: 0,
        period,
      });
    }

    const userPoints = userStats[0].totalPoints;

    // Count users with more points
    const higherRanked = await Activity.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$userId',
          totalPoints: { $sum: '$points' },
        },
      },
      { $match: { totalPoints: { $gt: userPoints } } },
      { $count: 'count' },
    ]);

    const rank = higherRanked.length > 0 ? higherRanked[0].count + 1 : 1;

    res.json({
      rank,
      totalPoints: userPoints,
      period,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user rank' });
  }
});

export default router;
