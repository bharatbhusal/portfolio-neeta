import { AppError } from "@/lib/errors";
import {
	comparePassword,
	hashPassword,
	signToken,
} from "@/lib/auth";
import {
	createUser,
	findUserByUsername,
} from "@/repositories/user";
import { LoginInput, SignupInput } from "@/lib/validators";
import { getEnvConfig } from "@/lib/env";

export function isOnboardingDisabled() {
	return getEnvConfig().DISABLE_ONBOARDING === "true";
}
export async function registerUser(
	input: SignupInput,
): Promise<{
	token: string;
	user: { id: string; username: string };
}> {
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
