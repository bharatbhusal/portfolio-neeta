import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
	{
		username: { type: String, required: true, trim: true },
		password: { type: String, required: true, select: false },
	},
	{ timestamps: true },
);

export const UserModel =
	models.User || model("User", userSchema);
