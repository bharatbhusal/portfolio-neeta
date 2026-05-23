import { Types } from "mongoose";

import { UserModel } from "@/models/user";

export async function createUser(data: {
	username: string;
	password: string;
}) {
	const user = await UserModel.create(data);
	return user.toObject();
}

export async function findUserByUsername(username: string) {
	return UserModel.findOne({ username }).select("+password");
}

export async function findUserById(userId: string) {
	if (!Types.ObjectId.isValid(userId)) {
		return null;
	}
	return UserModel.findById(userId);
}

export async function updateUserPassword(
	userId: string,
	password: string,
) {
	return UserModel.findByIdAndUpdate(
		userId,
		{ password },
		{ new: true, lean: true },
	);
}
