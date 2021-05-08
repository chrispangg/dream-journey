import router from "../api/activities";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../db/db-connect";
import { ActivityModel } from "../../db/schemas/activity-schema";
import { Trip } from "../../db/schemas/trip-schema";
import { getToken } from "../jwt";
import dayjs from 'dayjs';

const jwksRsa = require("jwks-rsa");
const expressJwt = require("express-jwt");
const request = require("request-promise-native");
const authConfig = require("../../../auth_config.json");

let mongod, app, server;
const PORT = 3001;
const firstMongoID = new mongoose.mongo.ObjectId("000000000000000000000004");
const secondMongoID = new mongoose.mongo.ObjectId("000000000000000000000005");
const thirdMongoID = new mongoose.mongo.ObjectId("000000000000000000000006");
const fourthMongoID = new mongoose.mongo.ObjectId("000000000000000000000007");
const noneExistID = new mongoose.mongo.ObjectId("000000000000000000000008");

jest.setTimeout(100000);

const firstActivity = {
    _id: firstMongoID,
	tripId: "000000000000000000000014",
    activity: "First activity details...",
    startDate: new Date("2021-04-11 GMT"),
	endDate: new Date("2021-05-30 GMT"),
    startTime: "16:08:59",
    finishTime: "16:10:00",
    longitude: 151.21,
    latitude: -33.868,
    location: "First activity location...",
    notes: "First activity notes...",
	userSub: "testing-user-one-sub",
};

const secondActivity = {
    _id: secondMongoID,
    tripId: "000000000000000000000007",
    activity: "Second activity details...",
    startDate: new Date("2021-04-18 GMT"),
	endDate: new Date("2021-04-25 GMT"),
    startTime: "11:25:33",
    finishTime: "14:46:30",
    longitude: 144.9632,
    latitude: -37.8142,
    location: "Second activity location...",
    notes: "Second activity notes...",
	userSub: "testing-user-one-sub",
};

const thirdActivity = {
    _id: thirdMongoID,
    tripId: "000000000000000000000015",
    activity: "Third activity details...",
    startDate: new Date("2021-05-17 GMT"),
	endDate: new Date("2021-07-09 GMT"),
    startTime: "07:25:33",
    finishTime: "22:46:30",
    longitude: 114.15861,
    latitude: 22.27833,
    location: "Third activity location...",
    notes: "Third activity notes...",
	userSub: "testing-user-one-sub",
};

const referenceTrip = {
	_id: fourthMongoID,
	locationName: "New York City, New York, United States",
	longitude: "151.21",
	latitude: "-33.868",
	startDate: new Date("2021-04-11 GMT"),
	endDate: new Date("2021-05-30 GMT"),
	userSub: "testing-user-one-sub",
};

const exampleActivities = [firstActivity, secondActivity, thirdActivity];

// Start database and server before any tests run
beforeAll(async (done) => {
	mongod = new MongoMemoryServer();
	await mongod.getUri().then((cs) => connectToDatabase(cs));
	app = express();

	const checkJwt = expressJwt({
		audience: authConfig.audience,
		issuer: authConfig.domain,
		algorithms: ["RS256"],
		secret: jwksRsa.expressJwtSecret({
			cache: true,
			rateLimit: true,
			jwksRequestsPerMinute: 5,
			jwksUri: `${authConfig.domain}.well-known/jwks.json`,
		}),
	});

	app.use("/", checkJwt);
	app.use(express.json());
	app.use("/api/activities", router);
	server = app.listen(PORT, done);
});

beforeEach(async () => {
	await ActivityModel.insertMany(exampleActivities);
    await Trip.insertMany(referenceTrip);
});

afterEach(async () => {
	await ActivityModel.deleteMany({});
    await Trip.deleteMany({});
});

afterAll((done) => {
	server.close(async () => {
		await mongoose.disconnect();
		await mongod.stop();
		done();
	});
});

const makeAuthdRequest = async (method, uri, body) => {
	const token = getToken();

	const options = {
		baseUrl: `http://localhost:${PORT}`,
		method,
		uri,
		headers: { Authorization: `Bearer ${token}` },
		resolveWithFullResponse: true,
		json: true,
	};

	if (body) options.body = body;

	const response = await request(options).catch((err) => {
		throw err;
	});
	
	return response;
};

// first test:
test("Retrieves all activities successfully!", async () => {
	const response = await makeAuthdRequest("GET", "/api/activities");

	expect(response.statusCode).toBe(200);
	const responseActivities = response.body;
	expect(responseActivities.length).toBe(3);

	for (let i = 0; i < responseActivities.length; i++) {
		const currentActivity = responseActivities[i];
		const expectActivity = exampleActivities[i];

		expect(currentActivity.tripId.toString()).toEqual(expectActivity.tripId.toString());
		expect(currentActivity.activity).toEqual(expectActivity.activity);
        expect(dayjs(currentActivity.startDate)).toEqual(dayjs(expectActivity.startDate));
		expect(dayjs(currentActivity.endDate)).toEqual(dayjs(expectActivity.endDate));
        expect(currentActivity.startTime).toEqual(expectActivity.startTime);
        expect(currentActivity.finishTime).toEqual(expectActivity.finishTime);
		expect(currentActivity.longitude).toEqual(expectActivity.longitude);
		expect(currentActivity.latitude).toEqual(expectActivity.latitude);
		expect(currentActivity.location).toEqual(expectActivity.location);
		expect(currentActivity.notes).toEqual(expectActivity.notes);
	}
});

test("Retrieves a single activity successfully!", async () => {
	const response = await makeAuthdRequest("GET", `/api/activities/${fourthMongoID}`);
	expect(response.statusCode).toBe(200);
	const responseActivity = response.body;

	const expectActivity = exampleActivities[1];

    expect(responseActivity[0].tripId).toEqual(expectActivity.tripId);
    expect(responseActivity[0].activity).toEqual(expectActivity.activity);
    expect(dayjs(responseActivity[0].startDate)).toEqual(dayjs(expectActivity.startDate));
    expect(dayjs(responseActivity[0].endDate)).toEqual(dayjs(expectActivity.endDate));
    expect(responseActivity[0].startTime).toEqual(expectActivity.startTime);
    expect(responseActivity[0].finishTime).toEqual(expectActivity.finishTime);
    expect(responseActivity[0].longitude).toEqual(expectActivity.longitude);
    expect(responseActivity[0].latitude).toEqual(expectActivity.latitude);
    expect(responseActivity[0].location).toEqual(expectActivity.location);
    expect(responseActivity[0].notes).toEqual(expectActivity.notes);
});

// Testing HTTP NOT FOUND
test('Returns a 404 when attempting to retrieve a nonexistent activity (valid id but not found)', async () => {
    try {
        await makeAuthdRequest("GET", `/api/activities/${noneExistID}`);
        fail('Should have thrown an exception.');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
    }
});

// // Testing invalid ID
test('Returns a 400 when attempting to retrieve a nonexistant activity (invalid id)', async () => {
    try {
        await makeAuthdRequest("GET", "/api/activities/undefinedurl");
        fail('Should have throen an exception.');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
    }
});

test('Create a new activity', async () => {
    const newActivity = {
        tripId: "000000000000000000000016",
        activity: "Test activity details...",
        startDate: new Date("2021-04-11 GMT"),
        endDate: new Date("2021-05-30 GMT"),
        startTime: "16:08:59",
        finishTime: "16:10:00",
        longitude: 151.21,
        latitude: -33.868,
        location: "Test activity location...",
        notes: "Test activity notes...",
        userSub: "testing-user-one-sub",
    };

    const response = await makeAuthdRequest("POST", "/api/activities", newActivity);

    expect(response.statusCode).toBe(200);
    const responseActivity = response.body;
    expect(responseActivity.tripId).toEqual(newActivity.tripId);
    expect(responseActivity.activity).toEqual(newActivity.activity);
    expect(dayjs(responseActivity.startDate)).toEqual(dayjs(newActivity.startDate));
    expect(dayjs(responseActivity.endDate)).toEqual(dayjs(newActivity.endDate));
    expect(responseActivity.startTime).toEqual(newActivity.startTime);
    expect(responseActivity.finishTime).toEqual(newActivity.finishTime);
    expect(responseActivity.longitude).toEqual(newActivity.longitude);
    expect(responseActivity.latitude).toEqual(newActivity.latitude);
    expect(responseActivity.location).toEqual(newActivity.location);
    expect(responseActivity.notes).toEqual(newActivity.notes);
    expect(responseActivity.userSub).toEqual(newActivity.userSub);

    const dbActivity = await ActivityModel.findById(responseActivity._id);
    expect(dbActivity.tripId).toEqual(newActivity.tripId);
    expect(dbActivity.activity).toEqual(newActivity.activity);
    expect(dayjs(dbActivity.startDate)).toEqual(dayjs(newActivity.startDate));
    expect(dayjs(dbActivity.endDate)).toEqual(dayjs(newActivity.endDate));
    expect(dbActivity.startTime).toEqual(newActivity.startTime);
    expect(dbActivity.finishTime).toEqual(newActivity.finishTime);
    expect(dbActivity.longitude).toEqual(newActivity.longitude);
    expect(dbActivity.latitude).toEqual(newActivity.latitude);
    expect(dbActivity.location).toEqual(newActivity.location);
    expect(dbActivity.notes).toEqual(newActivity.notes);
    expect(dbActivity.userSub).toEqual(newActivity.userSub);
});

test('Gives a 400 error when trying to create a activity with no activity', async () => {
    try {
        const newActivity = {
            tripId: "000000000000000000000017",
            startDate: new Date("2021-04-11 GMT"),
            endDate: new Date("2021-05-30 GMT"),
            startTime: "16:08:59",
            finishTime: "16:10:00",
            longitude: 151.21,
            latitude: -33.868,
            location: "Test activity location...",
            notes: "Test activity notes...",
            userSub: "testing-user-one-sub",
        };

        await makeAuthdRequest("POST", "/api/activities", newActivity);
        fail('Should have thrown an exception.');
    } catch (err) {
        // Ensure response is as expected
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);

        // Ensure DB wasn't modified
        expect(await ActivityModel.countDocuments()).toBe(3);
    }
});

test('Updates a activity successfully', async () => {
    const toUpdate = {
        _id: thirdMongoID,
        tripId: "000000000000000000000018",
        activity: "Update activity details...",
        startDate: new Date("2021-05-17 GMT"),
        endDate: new Date("2021-07-09 GMT"),
        startTime: "07:25:33",
        finishTime: "22:46:30",
        longitude: 114.15861,
        latitude: 22.27833,
        location: "Update activity location...",
        notes: "Update activity notes...",
        userSub: "testing-user-one-sub",
    }

	const response = await makeAuthdRequest("PUT", `/api/activities/${thirdMongoID}`, toUpdate);

    // Check response
    expect(response.statusCode).toBe(204);

    // Ensure DB was updated
    const dbActivity = await ActivityModel.findById(thirdActivity._id);
    expect(dbActivity.tripId).toEqual(toUpdate.tripId);
    expect(dbActivity.activity).toEqual(toUpdate.activity);
    expect(dayjs(dbActivity.startDate)).toEqual(dayjs(toUpdate.startDate));
    expect(dayjs(dbActivity.endDate)).toEqual(dayjs(toUpdate.endDate));
    expect(dbActivity.startTime).toEqual(toUpdate.startTime);
    expect(dbActivity.finishTime).toEqual(toUpdate.finishTime);
    expect(dbActivity.longitude).toEqual(toUpdate.longitude);
    expect(dbActivity.latitude).toEqual(toUpdate.latitude);
    expect(dbActivity.location).toEqual(toUpdate.location);
    expect(dbActivity.notes).toEqual(toUpdate.notes);
    expect(dbActivity.userSub).toEqual(toUpdate.userSub);
});

test('Gives a 404 when updating a nonexistant activity', async () => {
    try {
        const toUpdate = {
            _id: thirdMongoID,
            tripId: "000000000000000000000019",
            activity: "Update activity details...",
            startDate: new Date("2021-05-17 GMT"),
            endDate: new Date("2021-07-09 GMT"),
            startTime: "07:25:33",
            finishTime: "22:46:30",
            longitude: 114.15861,
            latitude: 22.27833,
            location: "Update activity location...",
            notes: "Update activity notes...",
            userSub: "testing-user-one-sub",
        }

        await makeAuthdRequest("PUT", `/api/activities/${noneExistID}`, toUpdate);
        fail('Should have returned a 404');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);

        // Make sure something wasn't added to the db
        expect(await ActivityModel.countDocuments()).toBe(3);
    }
});

test('Deletes an activity', async () => {

    const response = await makeAuthdRequest("DELETE", `/api/activities/${secondMongoID}`);
    expect(response.statusCode).toBe(200);

    // Check db item was deleted
    expect(await ActivityModel.findById(secondActivity._id)).toBeNull();
});

test('Doesn\'t delete anything when it shouldn\'t', async () => {
	try {
        await makeAuthdRequest("DELETE", `/api/activities/${noneExistID}`);
        fail('Should have returned a 404');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);

        // Make sure something wasn't added to the db
        expect(await ActivityModel.countDocuments()).toBe(3);
    }
});
