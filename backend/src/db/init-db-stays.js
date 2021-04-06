import mongoose from 'mongoose';
import connectToDatabase from './db-connect';
import { StayModel } from './schemas/stays-schema';
import { stays } from './sampleStaysData';

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
  await StayModel.deleteMany({});
}

async function addData() {
  for (let item of stays) {
    const dbStay = new StayModel(item);
    await dbStay.save();
  }
}
