import mongoose from "mongoose";
require("dotenv").config();

const DEFAULT_CONNECTION_STRING = process.env.DB_CONNECTION;

export default function connectToDatabase(
	connectionString = DEFAULT_CONNECTION_STRING
) {
	return mongoose.connect(connectionString, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}
