import dayjs from 'dayjs';
import { ActivityModel } from '../schemas/activity-schema';
import {StayModel} from "../schemas/stays-schema";

//Retrieve all activities

export async function retrieveAllActivities(userSub) {
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

// Retrieve an activity by activity Id for Auth
export async function retrieveActivityByActivityId (id) {
  return await ActivityModel.findById(id)
}

//Update activity details
export async function updateActivity(activity) {
  const result = await ActivityModel.findByIdAndUpdate(activity._id, activity, {
    new: true,
    useFindAndModify: false,
  });

  return result ? true : false;
}

//Delete Activity based on id
export async function deleteActivity(id) {
  return await ActivityModel.deleteOne({ _id: id });
}
