import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		//schema here
	},
	{
		timestamps: {},
	}
);

const User = mongoose.model("User", userSchema);

export { User };