import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tripSchema = new Schema({
	locationName: { type: String, required: true },
	locationPoint: { type: String, required: true },
	startDate: Date,
	endDate: Date
}, {
	timestamps: {}
});

const Trip = mongoose.model('Trip', tripSchema);

export { Trip };