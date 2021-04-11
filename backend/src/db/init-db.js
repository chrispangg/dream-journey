import mongoose from "mongoose";
import connectToDatabase from "./db-connect";
import { Trip } from "./schemas/trip-schema";
import { createTrip } from "./dao/trips-dao";

main();

async function main() {
	await connectToDatabase();
	console.log("Connected to database!");
	console.log();

	await clearDatabase();
	console.log();

	await addData();
	console.log();

	// Disconnect when complete
	await mongoose.disconnect();
	console.log("Disconnected from database!");
}

async function clearDatabase() {
	const result = await Trip.deleteMany();
	console.log(`Clear database (removed ${result.deletedCount} trips)`);
}

async function addData() {
	
}