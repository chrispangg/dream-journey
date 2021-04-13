import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tripSchema = new Schema({
	locationName: { type: String, required: true },
	longitude: { type: Number, required: true },
	latitude: { type: Number, required: true },
	startDate: Date,
	endDate: Date
}, {
	timestamps: {}
});

const Trip = mongoose.model('Trip', tripSchema);

export { Trip };