import mongoose from "mongoose";

const Schema = mongoose.Schema;

const activitySchema = new Schema(
	{
		//schema here
	},
	{
		timestamps: {},
	}
);

const Activity = mongoose.model("Activity", activitySchema);

export { Activity };