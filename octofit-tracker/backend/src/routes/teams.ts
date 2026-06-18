import express, { Request, Response } from 'express';
import { Team, User } from '../models/index.js';

const router = express.Router();

// Get all teams
router.get('/', async (req: Request, res: Response) => {
  try {
    const teams = await Team.find()
      .populate('captain', 'username email')
      .populate('members', 'username email fitnessLevel');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
});

// Get team by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('captain', 'username email')
      .populate('members', 'username email fitnessLevel');
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Create new team
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, captain } = req.body;
    
    // Check if team name already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ error: 'Team name already exists' });
    }

    // Verify captain exists
    const captainUser = await User.findById(captain);
    if (!captainUser) {
      return res.status(404).json({ error: 'Captain user not found' });
    }

    const team = new Team({
      name,
      description,
      captain,
      members: [captain],
    });

    await team.save();

    // Update user's teamId
    await User.findByIdAndUpdate(captain, { teamId: team._id });

    const populatedTeam = await Team.findById(team._id)
      .populate('captain', 'username email')
      .populate('members', 'username email fitnessLevel');
    
    res.status(201).json(populatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Add member to team
router.post('/:id/members', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (team.members.includes(userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    team.members.push(userId);
    await team.save();

    await User.findByIdAndUpdate(userId, { teamId: team._id });

    const updatedTeam = await Team.findById(team._id)
      .populate('captain', 'username email')
      .populate('members', 'username email fitnessLevel');

    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from team
router.delete('/:id/members/:userId', async (req: Request, res: Response) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    if (team.captain.toString() === req.params.userId) {
      return res.status(400).json({ error: 'Cannot remove team captain' });
    }

    team.members = team.members.filter(member => member.toString() !== req.params.userId);
    await team.save();

    await User.findByIdAndUpdate(req.params.userId, { $unset: { teamId: 1 } });

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

// Update team
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name, description, totalPoints } = req.body;
    
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { name, description, totalPoints },
      { new: true, runValidators: true }
    )
      .populate('captain', 'username email')
      .populate('members', 'username email fitnessLevel');

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team' });
  }
});

// Delete team
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Remove teamId from all members
    await User.updateMany(
      { teamId: req.params.id },
      { $unset: { teamId: 1 } }
    );

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team' });
  }
});

export default router;
