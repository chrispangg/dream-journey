import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tripSchema = new Schema(
	{
		//schema here
		//need to have user id
		//need to have long and lat
		//need to have location names
		//need to have start and end dates
	},
	{
		timestamps: {},
	}
);

const Trip = mongoose.model("Trip", tripSchema);

export { Trip };