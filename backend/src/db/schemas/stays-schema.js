import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const staySchema = new Schema(
  {
    hotel: String,
    checkInDate: Date,
    checkOutDate: Date,
    location: String,
    notes: String,
  },
  {
    timestamps: {},
  }
);

const StayModel = mongoose.model('Stays', staySchema);

export { StayModel };
