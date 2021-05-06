import router from "../api/activities";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../db/db-connect";
import { ActivityModel } from "../../db/schemas/activity-schema";
import { Trip } from "../../db/schemas/trip-schema";
import { getToken } from "./jwt";
import dayjs from 'dayjs';

const jwksRsa = require("jwks-rsa");
const expressJwt = require("express-jwt");
const request = require("request-promise-native");
const authConfig = require("../../../auth_config.json");

let mongod, app, server;

jest.setTimeout(100000);

const firstActivity = {
    _id: new mongoose.mongo.ObjectId("000000000000000000000004"),
	tripId: "000000000000000000000004",
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
    _id: new mongoose.mongo.ObjectId("000000000000000000000005"),
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
    _id: new mongoose.mongo.ObjectId("000000000000000000000006"),
    tripId: "000000000000000000000006",
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
	_id: new mongoose.mongo.ObjectId("000000000000000000000007"),
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
	server = app.listen(3001, done);
});

beforeEach(async () => {
	await ActivityModel.insertMany(exampleActivities);
    await Trip.insertMany(referenceTrip);
});

afterEach(async () => {
	await ActivityModel.deleteMany({});
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
		baseUrl: "http://localhost:3001",
		method,
		uri,
		headers: { Authorization: `Bearer ${token}` },
		resolveWithFullResponse: true,
		json: true,
	};

	if (body) options.body = body;

	console.log(options);

	const response = await request(options).catch((err) => {
		console.log("Error message: " + err.message);
		throw err;
	});
	
	return response;
};

// first test:
// test("Retrieves all activities successfully!", async () => {
// 	const response = await makeAuthdRequest("GET", "/api/activities");

// 	expect(response.statusCode).toBe(200);
// 	const responseActivities = response.body;
// 	expect(responseActivities.length).toBe(3);

// 	for (let i = 0; i < responseActivities.length; i++) {
// 		const currentActivity = responseActivities[i];
// 		const expectActivity = exampleActivities[i];

// 		expect(currentActivity.tripId.toString()).toEqual(expectActivity.tripId.toString());
// 		expect(currentActivity.activity).toEqual(expectActivity.activity);
//         expect(dayjs(currentActivity.startDate)).toEqual(dayjs(expectActivity.startDate));
// 		expect(dayjs(currentActivity.endDate)).toEqual(dayjs(expectActivity.endDate));
//         expect(currentActivity.startTime).toEqual(expectActivity.startTime);
//         expect(currentActivity.finishTime).toEqual(expectActivity.finishTime);
// 		expect(currentActivity.longitude).toEqual(expectActivity.longitude);
// 		expect(currentActivity.latitude).toEqual(expectActivity.latitude);
// 		expect(currentActivity.location).toEqual(expectActivity.location);
// 		expect(currentActivity.notes).toEqual(expectActivity.notes);
// 	}
// });

test("Retrieves a single trip successfully!", async () => {
	const response = await makeAuthdRequest("GET", "/api/activities/000000000000000000000007");
	expect(response.statusCode).toBe(200);
	const responseActivity = response.body;

	const expectActivity = exampleActivities[1];

    expect(responseActivity.tripId).toEqual(expectActivity.tripId);
    expect(responseActivity.activity).toEqual(expectActivity.activity);
    expect(dayjs(responseActivity.startDate)).toEqual(dayjs(expectActivity.startDate));
    expect(dayjs(responseActivity.endDate)).toEqual(dayjs(expectActivity.endDate));
    expect(responseActivity.startTime).toEqual(expectActivity.startTime);
    expect(responseActivity.finishTime).toEqual(expectActivity.finishTime);
    expect(responseActivity.longitude).toEqual(expectActivity.longitude);
    expect(responseActivity.latitude).toEqual(expectActivity.latitude);
    expect(responseActivity.location).toEqual(expectActivity.location);
    expect(responseActivity.notes).toEqual(expectActivity.notes);
});

// // Testing HTTP NOT FOUND
// test('Returns a 404 when attempting to retrieve a nonexistent trip (valid id but not found)', async () => {
//     try {
//         await makeAuthdRequest("GET", "/api/trips/000000000000000000000000");
//         fail('Should have thrown an exception.');
//     } catch (err) {
//         const { response } = err;
//         expect(response).toBeDefined();
//         expect(response.statusCode).toBe(404);
//     }
// });

// // Testing invalid ID
// test('Returns a 400 when attempting to retrieve a nonexistant trip (invalid id)', async () => {
//     try {
//         await makeAuthdRequest("GET", "/api/trips/undefinedurl");
//         fail('Should have throen an exception.');
//     } catch (err) {
//         const { response } = err;
//         expect(response).toBeDefined();
//         expect(response.statusCode).toBe(404);
//     }
// });

// // test('Create a new trip', async () => {
// //     const newTrip = {
// //         locationName: "Testing new trip",
// //         longitude: "101.17",
// //         latitude: "-22.67",
// //         startDate: new Date("2023-01-01 GMT"),
// //         endDate: new Date("2021-05-30 GMT"),
// //         userSub: "testing-user-one-sub"
// //     };

// //     const response = await makeAuthdRequest("POST", "/api/trips", newTrip);

// //     expect(response.status).toBe(201);
// //     expect(response.data).toBeDefined();
// //     const responseTrip = response.data;
// //     expect(responseTrip.locationName).toBe(newTrip.locationName);
// //     expect(responseTrip.longitude).toBe(newTrip.longitude);
// //     expect(responseTrip.latitude).toBe(newTrip.latitude);
// //     expect(dayjs(responseTrip.startDate)).toEqual(dayjs(newTrip.startDate));
// //     expect(dayjs(responseTrip.endDate)).toEqual(dayjs(newTrip.endDate));
// //     expect(responseTrip._id).toBeDefined();
// //     expect(response.headers.location).toBe(`/api/trips/${responseTrip._id}`);

// //     const dbTrip = await Trip.findById(responseTrip._id);
// //     expect(dbTrip.locationName).toBe(newTrip.locationName);
// //     expect(dbTrip.longitude).toBe(newTrip.longitude);
// //     expect(dbTrip.latitude).toBe(newTrip.latitude);
// //     expect(dayjs(dbTrip.startDate)).toEqual(dayjs(newTrip.startDate));
// //     expect(dayjs(dbTrip.endDate)).toEqual(dayjs(newTrip.endDate));
// // });

// // test('Gives a 400 error when trying to create a trip with no location name', async () => {
// //     try {
// //         const newTrip = {
// //             longitude: "101.17",
// //             latitude: "-22.67",
// //             startDate: new Date("2023-01-01 GMT"),
// //         	endDate: new Date("2021-05-30 GMT"),
// //             userSub: "testing-user-one-sub"
// //         }

// //         await makeAuthdRequest("POST", "/api/trips", newTrip);
// //         fail('Should have thrown an exception.');
// //     } catch (err) {

// //         // Ensure response is as expected
// //         const { response } = err;
// //         expect(response).toBeDefined();
// //         expect(response.status).toBe(400);

// //         // Ensure DB wasn't modified
// //         expect(await Todo.countDocuments()).toBe(3);
// //     }
// // });

// test('Updates a trip successfully', async () => {
//     const toUpdate = {
//         _id: new mongoose.mongo.ObjectId("000000000000000000000003"),
// 		locationName: "Update location",
// 		longitude: "111.235",
// 		latitude: "-17.548",
// 		startDate: new Date("2021-08-01 GMT"),
// 		endDate: new Date("2021-11-04 GMT"),
// 		userSub: "testing-user-one-sub",
//     }

//     // const response = await axios.put('http://localhost:3000/api/todos/000000000000000000000004', toUpdate);
// 	const response = await makeAuthdRequest("PUT", "/api/trips/000000000000000000000003", toUpdate);

//     // Check response
//     expect(response.statusCode).toBe(204);

//     // Ensure DB was updated
//     const dbTrip = await Trip.findById('000000000000000000000003');
//     expect(dbTrip.locationName).toBe(toUpdate.locationName);
//     expect(dbTrip.longitude).toBe(toUpdate.longitude);
//     expect(dbTrip.latitude).toBe(toUpdate.latitude);
//     expect(dayjs(dbTrip.startDate)).toEqual(dayjs(toUpdate.startDate));
//     expect(dayjs(dbTrip.endDate)).toEqual(dayjs(toUpdate.endDate));
// });

// test('Gives a 404 when updating a nonexistant todo', async () => {
//     try {
//         const toUpdate = {
//             _id: new mongoose.mongo.ObjectId('000000000000000000000007'),
//             locationName: "Update location",
// 			longitude: "111.235",
// 			latitude: "-17.548",
// 			startDate: new Date("2021-08-01 GMT"),
// 			endDate: new Date("2021-11-04 GMT"),
// 			userSub: "testing-user-one-sub",
//         }

//         await makeAuthdRequest("PUT", "/api/trips/000000000000000000000007", toUpdate);
//         fail('Should have returned a 404');
//     } catch (err) {
//         const { response } = err;
//         expect(response).toBeDefined();
//         expect(response.statusCode).toBe(404);

//         // Make sure something wasn't added to the db
//         expect(await Trip.countDocuments()).toBe(3);
//     }
// });

// test('Deletes a trip', async () => {

//     const response = await makeAuthdRequest("DELETE", "/api/trips/000000000000000000000001");
//     expect(response.statusCode).toBe(204);

//     // Check db item was deleted
//     expect(await Trip.findById('000000000000000000000001')).toBeNull();
// });

// test('Doesn\'t delete anything when it shouldn\'t', async () => {
// 	try {
//         await makeAuthdRequest("DELETE", "/api/trips/000000000000000000000007");
//         fail('Should have returned a 404');
//     } catch (err) {
//         const { response } = err;
//         expect(response).toBeDefined();
//         expect(response.statusCode).toBe(404);

//         // Make sure something wasn't added to the db
//         expect(await Trip.countDocuments()).toBe(3);
//     }
// });