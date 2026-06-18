import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Team, Activity, Workout } from './models/index.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

// Sample data
const users = [
  {
    username: 'octocat',
    email: 'octocat@github.com',
    password: 'password123',
    fitnessLevel: 'intermediate',
    goals: ['lose weight', 'build muscle', 'increase endurance'],
  },
  {
    username: 'mona',
    email: 'mona@github.com',
    password: 'password123',
    fitnessLevel: 'advanced',
    goals: ['marathon training', 'strength building'],
  },
  {
    username: 'hubot',
    email: 'hubot@github.com',
    password: 'password123',
    fitnessLevel: 'beginner',
    goals: ['get active', 'improve health'],
  },
  {
    username: 'github-cat',
    email: 'githubcat@github.com',
    password: 'password123',
    fitnessLevel: 'intermediate',
    goals: ['stay fit', 'team activities'],
  },
  {
    username: 'fitdev',
    email: 'fitdev@github.com',
    password: 'password123',
    fitnessLevel: 'advanced',
    goals: ['competitive training', 'peak performance'],
  },
];

const workouts = [
  {
    name: 'Morning Run',
    description: 'A refreshing morning run to start your day',
    activityType: 'running',
    duration: 30,
    difficulty: 'beginner',
    caloriesEstimate: 250,
    pointsEstimate: 30,
    instructions: [
      'Warm up with 5 minutes of walking',
      'Jog at a comfortable pace for 20 minutes',
      'Cool down with 5 minutes of walking',
      'Stretch major muscle groups',
    ],
    equipment: ['running shoes'],
  },
  {
    name: 'Interval Cycling',
    description: 'High-intensity interval training on a bike',
    activityType: 'cycling',
    duration: 45,
    difficulty: 'intermediate',
    caloriesEstimate: 400,
    pointsEstimate: 50,
    instructions: [
      'Warm up with 5 minutes of easy cycling',
      'Alternate between 2 minutes high intensity and 1 minute recovery',
      'Repeat for 30 minutes',
      'Cool down with 10 minutes of easy cycling',
    ],
    equipment: ['bicycle', 'helmet'],
  },
  {
    name: 'Strength Training',
    description: 'Full body strength workout',
    activityType: 'gym',
    duration: 60,
    difficulty: 'intermediate',
    caloriesEstimate: 350,
    pointsEstimate: 60,
    instructions: [
      'Warm up with 10 minutes of light cardio',
      'Squats: 3 sets of 12 reps',
      'Bench press: 3 sets of 10 reps',
      'Rows: 3 sets of 12 reps',
      'Shoulder press: 3 sets of 10 reps',
      'Cool down and stretch',
    ],
    equipment: ['dumbbells', 'barbell', 'bench'],
  },
  {
    name: 'Yoga Flow',
    description: 'Relaxing yoga session for flexibility and mindfulness',
    activityType: 'yoga',
    duration: 45,
    difficulty: 'beginner',
    caloriesEstimate: 150,
    pointsEstimate: 40,
    instructions: [
      'Start with breathing exercises',
      'Sun salutations: 5 rounds',
      'Warrior poses sequence',
      'Balance poses',
      'End with savasana',
    ],
    equipment: ['yoga mat'],
  },
  {
    name: 'Marathon Prep',
    description: 'Long distance run for marathon training',
    activityType: 'running',
    duration: 90,
    difficulty: 'advanced',
    caloriesEstimate: 800,
    pointsEstimate: 100,
    instructions: [
      'Warm up with dynamic stretches',
      'Run at marathon pace for 75 minutes',
      'Include hydration breaks every 20 minutes',
      'Cool down with 10 minutes of walking',
      'Post-run stretching routine',
    ],
    equipment: ['running shoes', 'water bottle', 'energy gels'],
  },
  {
    name: 'Pool Workout',
    description: 'Swimming intervals for cardio and endurance',
    activityType: 'swimming',
    duration: 40,
    difficulty: 'intermediate',
    caloriesEstimate: 350,
    pointsEstimate: 45,
    instructions: [
      'Warm up with 5 minutes easy swimming',
      'Freestyle: 8x50m at moderate pace',
      'Backstroke: 4x50m',
      'Kick drills: 5 minutes',
      'Cool down with easy swimming',
    ],
    equipment: ['swimsuit', 'goggles', 'swim cap'],
  },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Team.deleteMany({});
    await Activity.deleteMany({});
    await Workout.deleteMany({});
    console.log('Existing data cleared');

    // Insert users
    console.log('Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    // Create teams
    console.log('Creating teams...');
    const team1 = await Team.create({
      name: 'Fitness Warriors',
      description: 'Dedicated to pushing our limits',
      captain: createdUsers[0]._id,
      members: [createdUsers[0]._id, createdUsers[1]._id, createdUsers[2]._id],
      totalPoints: 0,
    });

    const team2 = await Team.create({
      name: 'Code & Cardio',
      description: 'Developers who love to stay active',
      captain: createdUsers[3]._id,
      members: [createdUsers[3]._id, createdUsers[4]._id],
      totalPoints: 0,
    });
    console.log('Created 2 teams');

    // Update users with team assignments
    await User.findByIdAndUpdate(createdUsers[0]._id, { teamId: team1._id });
    await User.findByIdAndUpdate(createdUsers[1]._id, { teamId: team1._id });
    await User.findByIdAndUpdate(createdUsers[2]._id, { teamId: team1._id });
    await User.findByIdAndUpdate(createdUsers[3]._id, { teamId: team2._id });
    await User.findByIdAndUpdate(createdUsers[4]._id, { teamId: team2._id });
    console.log('Updated users with team assignments');

    // Create activities for the past week
    console.log('Creating activities...');
    const activities = [];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const activityDate = new Date(now);
      activityDate.setDate(now.getDate() - i);

      // Octocat's activities
      activities.push({
        userId: createdUsers[0]._id,
        activityType: 'running',
        duration: 30 + Math.floor(Math.random() * 30),
        distance: 5 + Math.random() * 5,
        calories: 250 + Math.floor(Math.random() * 200),
        points: 30 + Math.floor(Math.random() * 30),
        date: activityDate,
        notes: 'Morning run felt great!',
      });

      // Mona's activities
      activities.push({
        userId: createdUsers[1]._id,
        activityType: 'gym',
        duration: 60 + Math.floor(Math.random() * 30),
        calories: 350 + Math.floor(Math.random() * 150),
        points: 50 + Math.floor(Math.random() * 30),
        date: activityDate,
        notes: 'Strength training session',
      });

      // Hubot's activities
      if (i % 2 === 0) {
        activities.push({
          userId: createdUsers[2]._id,
          activityType: 'walking',
          duration: 20 + Math.floor(Math.random() * 20),
          distance: 2 + Math.random() * 2,
          calories: 100 + Math.floor(Math.random() * 100),
          points: 15 + Math.floor(Math.random() * 15),
          date: activityDate,
          notes: 'Easy walk around the neighborhood',
        });
      }

      // GitHub-cat's activities
      activities.push({
        userId: createdUsers[3]._id,
        activityType: 'cycling',
        duration: 45 + Math.floor(Math.random() * 30),
        distance: 15 + Math.random() * 10,
        calories: 300 + Math.floor(Math.random() * 200),
        points: 40 + Math.floor(Math.random() * 30),
        date: activityDate,
        notes: 'Bike ride through the park',
      });

      // Fitdev's activities
      activities.push({
        userId: createdUsers[4]._id,
        activityType: 'running',
        duration: 60 + Math.floor(Math.random() * 30),
        distance: 10 + Math.random() * 5,
        calories: 500 + Math.floor(Math.random() * 200),
        points: 70 + Math.floor(Math.random() * 30),
        date: activityDate,
        notes: 'Long distance training',
      });
    }

    const createdActivities = await Activity.insertMany(activities);
    console.log(`Created ${createdActivities.length} activities`);

    // Calculate and update team points
    const team1Activities = createdActivities.filter(
      (a) =>
        a.userId.toString() === createdUsers[0]._id.toString() ||
        a.userId.toString() === createdUsers[1]._id.toString() ||
        a.userId.toString() === createdUsers[2]._id.toString()
    );
    const team1Points = team1Activities.reduce((sum, a) => sum + a.points, 0);
    await Team.findByIdAndUpdate(team1._id, { totalPoints: team1Points });

    const team2Activities = createdActivities.filter(
      (a) =>
        a.userId.toString() === createdUsers[3]._id.toString() ||
        a.userId.toString() === createdUsers[4]._id.toString()
    );
    const team2Points = team2Activities.reduce((sum, a) => sum + a.points, 0);
    await Team.findByIdAndUpdate(team2._id, { totalPoints: team2Points });
    console.log('Updated team points');

    // Insert workouts
    console.log('Creating workouts...');
    const createdWorkouts = await Workout.insertMany(workouts);
    console.log(`Created ${createdWorkouts.length} workouts`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSummary:');
    console.log(`- Users: ${createdUsers.length}`);
    console.log(`- Teams: 2`);
    console.log(`- Activities: ${createdActivities.length}`);
    console.log(`- Workouts: ${createdWorkouts.length}`);

    console.log('\nSample Users:');
    createdUsers.forEach((user) => {
      console.log(`  - ${user.username} (${user.email}) - ${user.fitnessLevel}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the seed function
seedDatabase();
