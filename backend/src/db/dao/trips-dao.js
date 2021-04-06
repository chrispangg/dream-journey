import dayjs from 'dayjs';
import { Trip } from '../schemas/trip-schema';

//Retrive all trips in a database
export async function retrieveAllTrips() {
  return await Trip.find();
}

//Retrieve all trips of a user
export async function retrieveAllUserTrips(userId) {
  const trips = [];
  const allTrips = await Trip.find();
  for (trip in allTrips) {
    //assuming there's a property called "userId" in the schema
    if ((trip.userId = userId)) {
      trips.push(trip);
    }
  }

  return trips;
}

// Retrieve trip details
export async function retrieveTrip(tripId) {
  return await Trip.findOne(tripId);
}

//Create a new trip
export async function createTrip(trip) {
  //trip should includes the userId
  const dbTrip = new Trip(trip);
  await dbTrip.save();
  return dbTrip;
}

//Update Trip details
export async function updateTrip(trip) {
  const dbTrip = await Trip.findById(trip._id);
  if (dbTrip) {
    //save the trip based on it's schema
    await dbTodo.save();

    return true;
  } else {
    return false;
  }
}

//Delete Trip based on id
export async function deleteTrip(id) {
  await Trip.deleteOne({ _id: id });

  //need to delete all activities of the trip as well
}
