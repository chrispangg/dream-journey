import dayjs from 'dayjs';
import { ActivityModel } from '../schemas/activity-schema';

//Retrieve all activities

export async function retrieveAllActivities() {
  return await ActivityModel.find({userSub: userSub});
}

export async function retrieveActivities(id) {
  return await ActivityModel.find({ tripId: id });
}

//Create a new activity
export async function createActivity(activity, userSub) {
  const dbActivity = new ActivityModel({...activity, userSub:userSub});
  await dbActivity.save();
  return dbActivity;
}

//Update activity details
export async function updateActivity(id, activity) {
  const dbActivity = await ActivityModel.findOne({ _id: id });
  if (dbActivity) {
    dbActivity.activity = activity.activity;
    dbActivity.startDate = activity.startDate;
    dbActivity.endDate = activity.endDate;
    dbActivity.startTime = activity.startTime;
    dbActivity.finishTime = activity.finishTime;
    dbActivity.location = activity.location;
    dbActivity.notes = activity.notes;
    await dbActivity.save();
    return true;
  } else {
    return false;
  }
}

//Delete Activity based on id
export async function deleteActivity(id) {
  return await ActivityModel.deleteOne({ _id: id });
}
