import router from "../api/trips";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectToDatabase from "../../db/db-connect";
import { Trip } from "../../db/schemas/trip-schema";
import { getToken } from "../jwt";
import dayjs from 'dayjs';

const jwksRsa = require("jwks-rsa");
const expressJwt = require("express-jwt");
const request = require("request-promise-native");
const authConfig = require("../../../auth_config.json");

let mongod, app, server;
const PORT = 3000;
const firstMongoID = new mongoose.mongo.ObjectId("000000000000000000000001");
const secondMongoID = new mongoose.mongo.ObjectId("000000000000000000000002");
const thirdMongoID = new mongoose.mongo.ObjectId("000000000000000000000003");
const noneExistID = new mongoose.mongo.ObjectId("000000000000000000000000");

jest.setTimeout(100000);

const firstTrip = {
	_id: firstMongoID,
	locationName: "New York City, New York, United States",
	longitude: "151.21",
	latitude: "-33.868",
	startDate: new Date("2021-04-11 GMT"),
	endDate: new Date("2021-05-30 GMT"),
	userSub: "testing-user-one-sub",
};

const secondTrip = {
	_id: secondMongoID,
	locationName: "Melbourne, Victoria, Australia",
	longitude: "144.9632",
	latitude: "-37.8142",
	startDate: new Date("2021-04-18 GMT"),
	endDate: new Date("2021-04-25 GMT"),
	userSub: "testing-user-one-sub",
};

const thirdTrip = {
	_id: thirdMongoID,
	locationName: "Sydney, New South Wales, Australia",
	longitude: "114.15861",
	latitude: "22.27833",
	startDate: new Date("2021-05-17 GMT"),
	endDate: new Date("2021-07-09 GMT"),
	userSub: "testing-user-one-sub",
};

const exampleTrips = [firstTrip, secondTrip, thirdTrip];

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
	app.use("/api/trips", router);
	server = app.listen(PORT, done);
});

beforeEach(async () => {
	await Trip.insertMany(exampleTrips);
});

afterEach(async () => {
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
test("Retrieves all trips successfully!", async () => {
	const response = await makeAuthdRequest("GET", "/api/trips");

	expect(response.statusCode).toBe(200);
	const responseTrips = response.body;
	expect(responseTrips.length).toBe(3);

	for (let i = 0; i < responseTrips.length; i++) {
		const currentTrip = responseTrips[i];
		const expectTrip = exampleTrips[i];

		expect(currentTrip._id.toString()).toEqual(expectTrip._id.toString());
		expect(currentTrip.locationName).toEqual(expectTrip.locationName);
		expect(currentTrip.longitude.toString()).toEqual(expectTrip.longitude.toString());
		expect(currentTrip.latitude.toString()).toEqual(expectTrip.latitude.toString());
		expect(dayjs(currentTrip.startDate)).toEqual(dayjs(expectTrip.startDate));
		expect(dayjs(currentTrip.endDate)).toEqual(dayjs(expectTrip.endDate));
	}
});

test("Retrieves a single trip successfully!", async () => {
	const response = await makeAuthdRequest("GET", `/api/trips/${secondMongoID}`);
	expect(response.statusCode).toBe(200);
	const responseTrips = response.body;

	const expectTrip = exampleTrips[1];

	expect(responseTrips._id.toString()).toEqual(expectTrip._id.toString());
	expect(responseTrips.locationName).toEqual(expectTrip.locationName);
	expect(responseTrips.longitude.toString()).toEqual(expectTrip.longitude.toString());
	expect(responseTrips.latitude.toString()).toEqual(expectTrip.latitude.toString());
	expect(dayjs(responseTrips.startDate)).toEqual(dayjs(expectTrip.startDate));
	expect(dayjs(responseTrips.endDate)).toEqual(dayjs(expectTrip.endDate));
});

// Testing HTTP NOT FOUND
test('Returns a 404 when attempting to retrieve a nonexistent trip (valid id but not found)', async () => {
    try {
        await makeAuthdRequest("GET", `/api/trips/${noneExistID}`);
        fail('Should have thrown an exception.');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
    }
});

// Testing invalid ID
test('Returns a 400 when attempting to retrieve a nonexistant trip (invalid id)', async () => {
    try {
        await makeAuthdRequest("GET", "/api/trips/undefinedurl");
        fail('Should have throen an exception.');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);
    }
});

test('Create a new trip', async () => {
    const newTrip = {
		result: {
			destination: "Testing new trip",
			longitude: "101.17",
			latitude: "-22.67",
			startDate: new Date("2023-01-01 GMT"),
			endDate: new Date("2021-05-30 GMT"),
			sub: "testing-user-one-sub"
		}
    };

    const response = await makeAuthdRequest("POST", "/api/trips", newTrip);

    expect(response.statusCode).toBe(201);
    const responseTrip = response.body;
    expect(responseTrip.locationName).toBe(newTrip.result.destination);
    expect(responseTrip.longitude).toBe(newTrip.result.longitude);
    expect(responseTrip.latitude).toBe(newTrip.result.latitude);
    expect(dayjs(responseTrip.startDate)).toEqual(dayjs(newTrip.result.startDate));
    expect(dayjs(responseTrip.endDate)).toEqual(dayjs(newTrip.result.endDate));
    expect(responseTrip._id).toBeDefined();
    expect(response.headers.location).toBe(`/api/trips/${responseTrip._id}`);

    const dbTrip = await Trip.findById(responseTrip._id);
    expect(dbTrip.locationName).toBe(newTrip.result.destination);
    expect(dbTrip.longitude).toBe(newTrip.result.longitude);
    expect(dbTrip.latitude).toBe(newTrip.result.latitude);
    expect(dayjs(dbTrip.startDate)).toEqual(dayjs(newTrip.result.startDate));
    expect(dayjs(dbTrip.endDate)).toEqual(dayjs(newTrip.result.endDate));
});

test('Gives a 400 error when trying to create a trip with no location name', async () => {
    try {
        const newTrip = {
            result: {
				longitude: "101.17",
				latitude: "-22.67",
				startDate: new Date("2023-01-01 GMT"),
				endDate: new Date("2021-05-30 GMT"),
				sub: "testing-user-one-sub"
			}
        }

        await makeAuthdRequest("POST", "/api/trips", newTrip);
        fail('Should have thrown an exception.');
    } catch (err) {
        // Ensure response is as expected
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(400);

        // Ensure DB wasn't modified
        expect(await Trip.countDocuments()).toBe(3);
    }
});

test('Updates a trip successfully', async () => {
    const toUpdate = {
        _id: thirdMongoID,
		locationName: "Update location",
		longitude: "111.235",
		latitude: "-17.548",
		startDate: new Date("2021-08-01 GMT"),
		endDate: new Date("2021-11-04 GMT"),
		userSub: "testing-user-one-sub",
    }

	const response = await makeAuthdRequest("PUT", `/api/trips/${thirdMongoID}`, toUpdate);

    // Check response
    expect(response.statusCode).toBe(204);

    // Ensure DB was updated
    const dbTrip = await Trip.findById(thirdTrip._id);
    expect(dbTrip.locationName).toBe(toUpdate.locationName);
    expect(dbTrip.longitude).toBe(toUpdate.longitude);
    expect(dbTrip.latitude).toBe(toUpdate.latitude);
    expect(dayjs(dbTrip.startDate)).toEqual(dayjs(toUpdate.startDate));
    expect(dayjs(dbTrip.endDate)).toEqual(dayjs(toUpdate.endDate));
});

test('Gives a 404 when updating a nonexistant trip', async () => {
    try {
        const toUpdate = {
            _id: noneExistID,
            locationName: "Update location",
			longitude: "111.235",
			latitude: "-17.548",
			startDate: new Date("2021-08-01 GMT"),
			endDate: new Date("2021-11-04 GMT"),
			userSub: "testing-user-one-sub",
        }

        await makeAuthdRequest("PUT", `/api/trips/${noneExistID}`, toUpdate);
        fail('Should have returned a 404');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);

        // Make sure something wasn't added to the db
        expect(await Trip.countDocuments()).toBe(3);
    }
});

test('Deletes a trip', async () => {

    const response = await makeAuthdRequest("DELETE", `/api/trips/${firstMongoID}`);
    expect(response.statusCode).toBe(204);

    // Check db item was deleted
    expect(await Trip.findById(firstTrip._id)).toBeNull();
});

test('Doesn\'t delete anything when it shouldn\'t', async () => {
	try {
        await makeAuthdRequest("DELETE", `/api/trips/${noneExistID}`);
        fail('Should have returned a 404');
    } catch (err) {
        const { response } = err;
        expect(response).toBeDefined();
        expect(response.statusCode).toBe(404);

        // Make sure something wasn't added to the db
        expect(await Trip.countDocuments()).toBe(3);
    }
});