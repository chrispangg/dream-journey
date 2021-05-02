import dayjs from 'dayjs';
import { StayModel } from '../schemas/stays-schema';

//Retrieve all stays

export async function retrieveAllStays() {
  return await StayModel.find({userSub: userSub});
}

//Retrieve stays based on tripId

export async function retrieveStays(id) {
  return await StayModel.find({ tripId: id });
}

//Create a new stay
export async function createStay(stay, userSub) {
  const dbStay = new StayModel({...stay, userSub: userSub});
  await dbStay.save();
  return dbStay;
}

//Update stay details
export async function updateStay(id, stay) {
  const dbStay = await StayModel.findOne({ _id: id });
  if (dbStay) {
    dbStay.hotel = stay.hotel;
    dbStay.checkInDate = stay.checkInDate;
    dbStay.checkOutDate = stay.checkOutDate;
    dbStay.location = stay.location;
    dbStay.notes = stay.notes;
    dbStay.userSub = stay.userSub;
    await dbStay.save();
    return true;
  } else {
    return false;
  }
}

//Delete Stay based on id
export async function deleteStay(id) {
  return await StayModel.deleteOne({ _id: id });
}
