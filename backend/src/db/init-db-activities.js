import mongoose from 'mongoose';
import connectToDatabase from './db-connect';
import { ActivityModel } from './schemas/activity-schema';
import { activities } from './sampleActivitiesData';

main();

async function main() {
  await connectToDatabase();
  console.log('Connected to database!');
  console.log();

  await clearDatabase();
  console.log();

  await addData();
  console.log();

  // Disconnect when complete
  await mongoose.disconnect();
  console.log('Disconnected from database!');
}

async function clearDatabase() {
  await ActivityModel.deleteMany({});
}

async function addData() {
  for (let item of activities) {
    const dbActivity = new ActivityModel(item);
    await dbActivity.save();
  }
}
