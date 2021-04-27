import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const staySchema = new Schema(
  {
    tripId: String,
    hotel: String,
    checkInDate: Date,
    checkOutDate: Date,
    longitude: Number,
    latitude: Number,
    location: String,
    notes: String,
  },
  {
    timestamps: {},
  }
);

const StayModel = mongoose.model('Stays', staySchema);

export { StayModel };
