import mongoose from 'mongoose';

const DEFAULT_CONNECTION_STRING =
  'mongodb+srv://dbLab4:Hoian87@cluster0.hbqdh.mongodb.net/DreamJourney?retryWrites=true&w=majority';

export default function connectToDatabase(
  connectionString = DEFAULT_CONNECTION_STRING
) {
  return mongoose.connect(connectionString, {
    useNewUrlParser: true,
  });
}
