import mongoose from 'mongoose';

const DEFAULT_CONNECTION_STRING = 'mongodb+srv://cpan271:cpan271@cluster0.nsvzu.mongodb.net/DreamJourney?retryWrites=true&w=majority';

export default function connectToDatabase(connectionString = DEFAULT_CONNECTION_STRING) {
    return mongoose.connect(connectionString, {
        useNewUrlParser: true
    });
}