import express from "express";
import * as tripsDao from "../../db/dao/trips-dao";

// const HTTP_OK = 200; // Not really needed; this is the default if you don't set something else.
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;
const HTTP_NO_CONTENT = 204;

const router = express.Router();

//creating a new trip
router.post("/", async (req, res) => {
	console.log(req.body);
	const newTrip = await tripsDao.createTrip(req.body.result);
	console.log("Add trip: " + newTrip);

	res.status(HTTP_CREATED)
	   .header("Location", `/api/trips/${newTrip._id}`)
	   .json(newTrip);
});

// retrieve all trips
router.get('/', async (req, res) => {
	console.log("Testing retrieve all trips");
	res.json(await tripsDao.retrieveAllTrips());
});

//Retrive all trips (of a user)
router.get("/user/:userId", async (req, res) => {
	const { userId } = req.params;
	res.json(await tripsDao.retrieveAllUserTrips(userId));
});

//Retrieve single trip
router.get("/:tripId", async (req, res) => {
	const { tripId } = req.params;
	let trip = null;
	try {
		trip = await tripsDao.retrieveTrip(tripId);
	} catch (err) {
		console.log(err);
		res.sendStatus(400);
	}
	if (todo) {
		res.json(trip);
	} else {
		res.sendStatus(HTTP_NOT_FOUND);
	}
});

//Update trip
router.put("/:tripId", async (req, res) => {
	try {
		const { tripId } = req.params;
		
		const trip = req.body;
		console.log(trip);
		trip._id = tripId;
		const success = await tripsDao.updateTrip(trip);
		res.sendStatus(success ? HTTP_NO_CONTENT : HTTP_NOT_FOUND);
	} catch {
		res.sendStatus(400);
	}
});

// Delete trip
router.delete("/:tripId", async (req, res) => {
	try {
		const { tripId } = req.params;
		await tripsDao.deleteTrip(tripId);
		res.sendStatus(HTTP_NO_CONTENT);
	} catch {
		res.sendStatus(400);
	}
});

export default router;
