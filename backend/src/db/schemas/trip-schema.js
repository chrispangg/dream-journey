import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const tripSchema = new Schema({
	locationName: { type: String, required: true },
	longitude: { type: String, required: true },
	latitude: { type: String, required: true },
	startDate: { type: Date, required: true },
	endDate: { type: Date, required: true },
	userSub: String
}, {
	timestamps: {}
});

const Trip = mongoose.model('Trip', tripSchema);

export { Trip };