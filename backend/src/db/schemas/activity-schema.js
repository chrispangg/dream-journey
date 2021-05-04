import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const activitySchema = new Schema(
  {
    tripId: String,
    activity: String,
    startDate: Date,
    endDate: Date,
    startTime: String,
    finishTime: String,
    longitude: Number,
    latitude: Number,
    location: String,
    notes: String,
    userSub: String,
  },
  {
    timestamps: {},
  }
);

const ActivityModel = mongoose.model('Activity', activitySchema);

export { ActivityModel };
