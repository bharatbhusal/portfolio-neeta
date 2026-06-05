import { AppError } from "@/lib/errors";
import {
	comparePassword,
	getAuthPayload,
	hashPassword,
	signToken,
} from "@/lib/auth";
import {
	createUser,
	findUserById,
	findUserByUsername,
} from "@/repositories/user";
import { LoginInput, SignupInput } from "@/lib/validators";
import { getEnvConfig } from "@/lib/env";
import { connectToDatabase } from "@/lib/db";
import type { AuthUser } from "@/types/auth";

export function isOnboardingDisabled() {
	return getEnvConfig().DISABLE_ONBOARDING === "true";
}
export async function registerUser(
	input: SignupInput,
): Promise<{
	token: string;
	user: { id: string; username: string };
}> {
	await connectToDatabase();
	const existing = await findUserByUsername(input.username);
	if (existing) {
		throw new AppError(
			"Username already in use",
			409,
			"USERNAME_EXISTS",
		);
	}

	const password = await hashPassword(input.password);
	const user = await createUser({
		username: input.username,
		password,
	});

	const token = signToken({
		userId: user._id.toString(),
		username: user.username,
	});

	return {
		token,
		user: {
			id: user._id.toString(),
			username: user.username,
		},
	};
}

export async function loginUser(
	input: LoginInput,
): Promise<{
	token: string;
	user: { id: string; username: string };
}> {
	await connectToDatabase();
	const user = await findUserByUsername(input.username);
	if (!user?.password) {
		throw new AppError(
			"Invalid username or password",
			401,
			"INVALID_CREDENTIALS",
		);
	}

	const isValid = await comparePassword(
		input.password,
		user.password,
	);
	if (!isValid) {
		throw new AppError(
			"Invalid username or password",
			401,
			"INVALID_CREDENTIALS",
		);
	}

	const token = signToken({
		userId: user._id.toString(),
		email: user.email,
	});

	return {
		token,
		user: {
			id: user._id.toString(),
			username: user.username,
		},
	};
}

export async function getAuthenticatedUser(): Promise<AuthUser> {
	await connectToDatabase();
	const auth = await getAuthPayload();
	const user = await findUserById(auth.userId);

	if (!user) {
		throw new AppError("User not found", 404, "NOT_FOUND");
	}

	return {
		id: user._id.toString(),
		name: user.username,
		username: user.username,
	};
}

export async function getAuthenticatedUserOrNull() {
	try {
		return await getAuthenticatedUser();
	} catch {
		return null;
	}
}
