import router from "../api/trips";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import axios from "axios";
import connectToDatabase from "../../db/db-connect";
import { Trip } from "../../db/schemas/trip-schema";
import { getToken } from "./jwt";
const jwksRsa = require("jwks-rsa");
const expressJwt = require("express-jwt");
const request = require("request-promise-native");
const authConfig = require("../../../auth_config.json");

// const config = require("./config");

let mongod, app, server;

jest.setTimeout(100000);

const firstTrip = {
	_id: new mongoose.mongo.ObjectId("000000000000000000000001"),
	locationName: "New York City, New York, United States",
	longitude: "151.21",
	latitude: "-33.868",
	startDate: new Date(2021, 4, 11),
	endDate: new Date(2021, 5, 30),
	userSub: "testing-user-one-sub",
};
const secondTrip = {
	_id: new mongoose.mongo.ObjectId("000000000000000000000002"),
	locationName: "Melbourne, Victoria, Australia",
	longitude: "144.9632",
	latitude: "-37.8142",
	startDate: new Date(2021, 4, 18),
	endDate: new Date(2021, 4, 25),
	userSub: "testing-user-one-sub",
};
const thirdTrip = {
	_id: new mongoose.mongo.ObjectId("000000000000000000000003"),
	locationName: "Sydney, New South Wales, Australia",
	longitude: "114.15861",
	latitude: "22.27833",
	startDate: new Date(2021, 5, 17),
	endDate: new Date(2021, 7, 9),
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
	server = app.listen(3001, done);
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

	// const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlhZN0czcmpydU5ZdDA5QkpjSWZ2TCJ9.eyJnaXZlbl9uYW1lIjoiSmVuLUNoaWgiLCJmYW1pbHlfbmFtZSI6IkxpbiIsIm5pY2tuYW1lIjoiamVycnk1MDcwOCIsIm5hbWUiOiJKZW4tQ2hpaCBMaW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2kwbnAtSU5zOUV6b1Ryb1lrZVdNSlpEbGViTlk3T3VrZXcwMG9XZGc9czk2LWMiLCJsb2NhbGUiOiJ6aC1UVyIsInVwZGF0ZWRfYXQiOiIyMDIxLTA1LTA1VDEwOjU3OjMzLjA5MFoiLCJlbWFpbCI6ImplcnJ5NTA3MDhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vZGV2LXoxa2R4a3l3LmF1LmF1dGgwLmNvbS8iLCJzdWIiOiJnb29nbGUtb2F1dGgyfDEwMzE2NzQ5MDQwNjYzMDI5NTgyMiIsImF1ZCI6IlZxVHhheVlSNklBcVlEVVludHdnZkRSdG1xUHdydm5wIiwiaWF0IjoxNjIwMjE1ODE1LCJleHAiOjE2MjAyNTE4MTUsIm5vbmNlIjoiYjJocFRtbG5RVVZMWms1SVNqVk9abEZGYzJvdFZYNXlTV0YwV0dwVVVFcEZXbWt1Wm1oYWRYazNNZz09In0.q06hda3O1QQSEHKEhwJ_Zk0JL2MNjQJZqTI0u24OMja7sAKGyBo-mGfKAhq0iNjEZ9s_d2J9RDiuFvqwiRf2Tei_o30xZAz2m2_FGpH1nGltTN04yfcNuYryarfN5M4GKPIKIkXYfcEkCTzuEzq6KRILTm2KNeURI4yEyoJCyEk8OCzNh5sbw82opIyJeifud5VlZxbCsTqNAB0TG-bfeDgpx-M4cl-U11oBbw1yaI6U5NHMQg8fgQ3vqbkoEwfHMbyYDzNvmWCnxwSYAETh2n3_Y0hO55RZBmRjPa2N3wL6bUOqyZgUyBT2c6JlFk9RpjBsRsceV9WXbVEEeZgbUQ";

	console.log(token);

	const options = {
		baseUrl: "http://localhost:3001",
		method,
		uri,
		headers: { Authorization: `Bearer ${token}` },
		resolveWithFullResponse: true,
		json: true,
	};
	if (body) options.body = body;
	const response = await request(options).catch((err) => {
		console.log("Error message: " + err.message);
		throw err;
	});
	console.log("second testinginginging");
	return response;
};
// first test:
test("Retrieves all trips successfully!", async () => {
	console.log("testinginginging");
	// const response = await axios.get('http://localhost:3001/api/trips');
	const response = await makeAuthdRequest("GET", "/api/trips");
	console.log(response);

	expect(response.statusCode).toBe(200);
	const responseTrips = response.body;
	expect(responseTrips.length).toBe(3);
	for (let i = 0; i < responseTrips.length; i++) {
		const currentTrip = responseTrips[i];
		const expectTrip = exampleTrips[i];
		expect(currentTrip._id.toString()).toEqual(expectTrip._id.toString);
		expect(currentTrip.locationName).toEqual(expectTrip.locationName);
		expect(currentTrip.longitude.toString()).toEqual(
			expectTrip.longitude.toString()
		);
		expect(currentTrip.latitude.toString()).toEqual(
			expectTrip.latitude.toString()
		);
		expect(currentTrip.startDate.toString()).toEqual(
			expectTrip.startDate.toString()
		);
		expect(currentTrip.endDate.toString()).toEqual(
			expectTrip.endDate.toString()
		);
	}
});
test("Retrieves a single trip successfully!", async () => {
	//     const response = await axios.get('http://localhost:3001/api/trips');
	const response = await makeAuthdRequest(
		"GET",
		"/api/trips/000000000000000000000002"
	);
	expect(response.statusCode).toBe(200);
	    const responseTrips = response.body;

	    const expectTrip = exampleTrips[1];

	    expect(responseTrips._id.toString()).toEqual(expectTrip._id.toString());
	    expect(responseTrips.locationName).toEqual(expectTrip.locationName);
	    expect(responseTrips.longitude.toString()).toEqual(expectTrip.longitude.toString());
	    expect(responseTrips.latitude.toString()).toEqual(expectTrip.latitude.toString());
	//     expect(responseTrips.startDate.toString()).toEqual(expectTrip.startDate.toString());
	//     expect(responseTrips.endDate.toString()).toEqual(expectTrip.endDate.toString());
});
