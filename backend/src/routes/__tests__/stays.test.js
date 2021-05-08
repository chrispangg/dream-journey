import router from "../api/stays";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../db/db-connect";
import { StayModel } from '../../db/schemas/stays-schema';
import { Trip } from "../../db/schemas/trip-schema";
import { getToken } from "../jwt";
import dayjs from 'dayjs';

const jwksRsa = require("jwks-rsa");
const expressJwt = require("express-jwt");
const request = require("request-promise-native");
const authConfig = require("../../../auth_config.json");

let mongod, app, server;
const PORT = 3003;
const firstMongoID = new mongoose.mongo.ObjectId("000000000000000000000009");
const secondMongoID = new mongoose.mongo.ObjectId("000000000000000000000010");
const thirdMongoID = new mongoose.mongo.ObjectId("000000000000000000000011");
const fourthMongoID = new mongoose.mongo.ObjectId("000000000000000000000012");
const noneExistID = new mongoose.mongo.ObjectId("000000000000000000000013");

jest.setTimeout(100000);

const firstStay = {
    _id: firstMongoID,
	tripId: "000000000000000000000005",
    hotel: "First hotel details...",
    checkInDate: new Date("2021-04-11 GMT"),
	checkOutDate: new Date("2021-05-30 GMT"),
    longitude: 151.21,
    latitude: -33.868,
    location: "First hotel location...",
    notes: "First hotel notes...",
	userSub: "testing-user-one-sub",
};

const secondStay = {
    _id: secondMongoID,
    tripId: "000000000000000000000012",
    hotel: "Second hotel details...",
    checkInDate: new Date("2021-04-18 GMT"),
	checkOutDate: new Date("2021-04-25 GMT"),
    longitude: 144.9632,
    latitude: -37.8142,
    location: "Second hotel location...",
    notes: "Second hotel notes...",
	userSub: "testing-user-one-sub",
};

const thirdStay = {
    _id: thirdMongoID,
    tripId: "000000000000000000000007",
    hotel: "Third hotel details...",
    checkInDate: new Date("2021-05-17 GMT"),
	checkOutDate: new Date("2021-07-09 GMT"),
    longitude: 114.15861,
    latitude: 22.27833,
    location: "Third hotel location...",
    notes: "Third hotel notes...",
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

const exampleStays = [firstStay, secondStay, thirdStay];

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
	app.use("/api/stays", router);
	server = app.listen(PORT, done);
});

beforeEach(async () => {
	await StayModel.insertMany(exampleStays);
    await Trip.insertMany(referenceTrip);
});

afterEach(async () => {
	await StayModel.deleteMany({});
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
test("Retrieves all stays successfully!", async () => {
	const response = await makeAuthdRequest("GET", "/api/stays");

	expect(response.statusCode).toBe(200);
	const responseStays = response.body;
	expect(responseStays.length).toBe(3);

	for (let i = 0; i < responseStays.length; i++) {
		const currentStay = responseStays[i];
		const expectStay = exampleStays[i];

		expect(currentStay.tripId.toString()).toEqual(expectStay.tripId.toString());
		expect(currentStay.hotel).toEqual(expectStay.hotel);
        expect(dayjs(currentStay.checkInDate)).toEqual(dayjs(expectStay.checkInDate));
		expect(dayjs(currentStay.checkOutDate)).toEqual(dayjs(expectStay.checkOutDate));
		expect(currentStay.longitude).toEqual(expectStay.longitude);
		expect(currentStay.latitude).toEqual(expectStay.latitude);
		expect(currentStay.location).toEqual(expectStay.location);
		expect(currentStay.notes).toEqual(expectStay.notes);
	}
});

test("Retrieves a single stays successfully!", async () => {
	const response = await makeAuthdRequest("GET", `/api/stays/${fourthMongoID}`);
	expect(response.statusCode).toBe(200);
	const responseStay = response.body;

	const expectStay = exampleStays[1];

    expect(responseStay[0].tripId).toEqual(expectStay.tripId);
    expect(responseStay[0].hotel).toEqual(expectStay.hotel);
    expect(dayjs(responseStay[0].checkInDate)).toEqual(dayjs(expectStay.checkInDate));
    expect(dayjs(responseStay[0].checkOutDate)).toEqual(dayjs(expectStay.checkOutDate));
    expect(responseStay[0].longitude).toEqual(expectStay.longitude);
    expect(responseStay[0].latitude).toEqual(expectStay.latitude);
    expect(responseStay[0].location).toEqual(expectStay.location);
    expect(responseStay[0].notes).toEqual(expectStay.notes);
});

// // Testing HTTP NOT FOUND
test('Returns a 404 when attempting to retrieve a nonexistent stay (valid id but not found)', async () => {
    try {
        await makeAuthdRequest("GET", `/api/stays/${noneExistID}`);
        fail('Should have thrown an exception.');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
    }
});

// // // Testing invalid ID
test('Returns a 400 when attempting to retrieve a nonexistant stay (invalid id)', async () => {
    try {
        await makeAuthdRequest("GET", "/api/stays/undefinedurl");
        fail('Should have throen an exception.');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
    }
});

test('Create a new stay', async () => {
    const newStay = {
        tripId: "000000000000000000000005",
        hotel: "First hotel details...",
        checkInDate: new Date("2021-04-11 GMT"),
        checkOutDate: new Date("2021-05-30 GMT"),
        longitude: 151.21,
        latitude: -33.868,
        location: "First hotel location...",
        notes: "First hotel notes...",
        userSub: "testing-user-one-sub",
    };

    const response = await makeAuthdRequest("POST", "/api/stays", newStay);

    expect(response.statusCode).toBe(200);
    const responseStay = response.body;
    expect(responseStay.tripId).toEqual(newStay.tripId);
    expect(responseStay.hotel).toEqual(newStay.hotel);
    expect(dayjs(responseStay.checkInDate)).toEqual(dayjs(newStay.checkInDate));
    expect(dayjs(responseStay.checkOutDate)).toEqual(dayjs(newStay.checkOutDate));
    expect(responseStay.longitude).toEqual(newStay.longitude);
    expect(responseStay.latitude).toEqual(newStay.latitude);
    expect(responseStay.location).toEqual(newStay.location);
    expect(responseStay.notes).toEqual(newStay.notes);
    expect(responseStay.userSub).toEqual(newStay.userSub);

    const dbStay = await StayModel.findById(responseStay._id);
    expect(dbStay.tripId).toEqual(newStay.tripId);
    expect(dbStay.hotel).toEqual(newStay.hotel);
    expect(dayjs(dbStay.checkInDate)).toEqual(dayjs(newStay.checkInDate));
    expect(dayjs(dbStay.checkOutDate)).toEqual(dayjs(newStay.checkOutDate));
    expect(dbStay.longitude).toEqual(newStay.longitude);
    expect(dbStay.latitude).toEqual(newStay.latitude);
    expect(dbStay.location).toEqual(newStay.location);
    expect(dbStay.notes).toEqual(newStay.notes);
    expect(dbStay.userSub).toEqual(newStay.userSub);
});

test('Gives a 400 error when trying to create a stay with no hotel', async () => {
    try {
        const newStay = {
            tripId: "000000000000000000000006",
            checkInDate: new Date("2021-04-11 GMT"),
            checkOutDate: new Date("2021-05-30 GMT"),
            longitude: 151.21,
            latitude: -33.868,
            location: "First hotel location...",
            notes: "First hotel notes...",
            userSub: "testing-user-one-sub",
        };

        await makeAuthdRequest("POST", "/api/stays", newStay);
        fail('Should have thrown an exception.');
    } catch (err) {
        // Ensure response is as expected
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);

        // Ensure DB wasn't modified
        expect(await StayModel.countDocuments()).toBe(3);
    }
});

test('Updates a stay successfully', async () => {
    const toUpdate = {
        _id: thirdMongoID,
        tripId: "000000000000000000000007",
        hotel: "Update hotel details...",
        checkInDate: new Date("2021-05-17 GMT"),
        checkOutDate: new Date("2021-07-09 GMT"),
        longitude: 114.15861,
        latitude: 22.27833,
        location: "Update hotel location...",
        notes: "Update hotel notes...",
        userSub: "testing-user-one-sub",
    };

	const response = await makeAuthdRequest("PUT", `/api/stays/${thirdMongoID}`, toUpdate);

    // Check response
    expect(response.statusCode).toBe(204);

    // Ensure DB was updated
    const dbStay = await StayModel.findById(thirdMongoID);
    expect(dbStay.tripId).toEqual(toUpdate.tripId);
    expect(dbStay.hotel).toEqual(toUpdate.hotel);
    expect(dayjs(dbStay.checkInDate)).toEqual(dayjs(toUpdate.checkInDate));
    expect(dayjs(dbStay.checkOutDate)).toEqual(dayjs(toUpdate.checkOutDate));
    expect(dbStay.longitude).toEqual(toUpdate.longitude);
    expect(dbStay.latitude).toEqual(toUpdate.latitude);
    expect(dbStay.location).toEqual(toUpdate.location);
    expect(dbStay.notes).toEqual(toUpdate.notes);
    expect(dbStay.userSub).toEqual(toUpdate.userSub);
});

test('Gives a 404 when updating a nonexistant stay', async () => {
    try {
        const toUpdate = {
            _id: noneExistID,
            tripId: "000000000000000000000007",
            hotel: "Update hotel details...",
            checkInDate: new Date("2021-05-17 GMT"),
            checkOutDate: new Date("2021-07-09 GMT"),
            longitude: 114.15861,
            latitude: 22.27833,
            location: "Update hotel location...",
            notes: "Update hotel notes...",
            userSub: "testing-user-one-sub",
        };

        await makeAuthdRequest("PUT", `/api/stays/${noneExistID}`, toUpdate);
        fail('Should have returned a 404');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);

        // Make sure something wasn't added to the db
        expect(await StayModel.countDocuments()).toBe(3);
    }
});

test('Deletes an stay', async () => {
    const response = await makeAuthdRequest("DELETE", `/api/stays/${firstMongoID}`);
    expect(response.statusCode).toBe(200);

    // Check db item was deleted
    expect(await StayModel.findById(`${firstMongoID}`)).toBeNull();
});

test('Doesn\'t delete anything when it shouldn\'t', async () => {
	try {
        await makeAuthdRequest("DELETE", `/api/stays/${noneExistID}`);
        fail('Should have returned a 404');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);

        // Make sure something wasn't added to the db
        expect(await StayModel.countDocuments()).toBe(3);
    }
});