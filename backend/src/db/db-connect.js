import mongoose from 'mongoose';

// const DEFAULT_CONNECTION_STRING = 'mongodb+srv://cpan271:cpan271@cluster0.nsvzu.mongodb.net/DreamJourney?retryWrites=true&w=majority';
// const DEFAULT_CONNECTION_STRING = 'mongodb+srv://dbLab4:Hoian87@cluster0.hbqdh.mongodb.net/DreamJourney?retryWrites=true&w=majority';
const JERRY_CONNECTION_STRING = 'mongodb+srv://dbJernus:jerry289@snowpiercer.pyxbr.mongodb.net/final-project-jerry-test';

export default function connectToDatabase(connectionString = JERRY_CONNECTION_STRING) {
    return mongoose.connect(connectionString, {
        useNewUrlParser: true
    });
}