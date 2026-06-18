import express, { Request, Response } from 'express';
import { Workout, User } from '../models/index.js';

const router = express.Router();

// Get all workouts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { difficulty, activityType } = req.query;
    
    let query: any = {};
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (activityType) {
      query.activityType = activityType;
    }
    
    const workouts = await Workout.find(query).sort({ difficulty: 1, duration: 1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

// Get workout by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
});

// Get personalized workout suggestions for a user
router.get('/suggestions/:userId', async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { limit = 5 } = req.query;

    // Get workouts matching user's fitness level
    const workouts = await Workout.find({
      difficulty: user.fitnessLevel,
    })
      .limit(parseInt(limit as string))
      .sort({ pointsEstimate: -1 });

    res.json({
      userId: user._id,
      fitnessLevel: user.fitnessLevel,
      suggestions: workouts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch workout suggestions' });
  }
});

// Create new workout
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      activityType,
      duration,
      difficulty,
      caloriesEstimate,
      pointsEstimate,
      instructions,
      equipment,
    } = req.body;

    const workout = new Workout({
      name,
      description,
      activityType,
      duration,
      difficulty,
      caloriesEstimate,
      pointsEstimate,
      instructions,
      equipment,
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create workout' });
  }
});

// Update workout
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const {
      name,
      description,
      activityType,
      duration,
      difficulty,
      caloriesEstimate,
      pointsEstimate,
      instructions,
      equipment,
    } = req.body;

    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        activityType,
        duration,
        difficulty,
        caloriesEstimate,
        pointsEstimate,
        instructions,
        equipment,
      },
      { new: true, runValidators: true }
    );

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Delete workout
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const workout = await Workout.findByIdAndDelete(req.params.id);
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
});

export default router;
