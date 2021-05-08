import dayjs from 'dayjs';
import { StayModel } from '../schemas/stays-schema';
import {Trip} from "../schemas/trip-schema";

//Retrieve all stays

export async function retrieveAllStays(userSub) {
  return await StayModel.find({userSub: userSub});
}

//Retrieve stays based on tripId

export async function retrieveStays(id) {
  return await StayModel.find({ tripId: id });
}

// Retrieve a stay by stay Id for Auth
export async function retrieveStayByStayId (id) {
  return await StayModel.findById(id)
}

//Create a new stay
export async function createStay(stay, userSub) {
  const dbStay = new StayModel({...stay, userSub: userSub});
  await dbStay.save();
  return dbStay;
}

//Update stay details
export async function updateStay(stay) {
  const result = await StayModel.findByIdAndUpdate(stay._id, stay, {
    new: true,
    useFindAndModify: false,
  });

  return result ? true : false;
}

//Delete Stay based on id
export async function deleteStay(id) {
  return await StayModel.deleteOne({ _id: id });
}
