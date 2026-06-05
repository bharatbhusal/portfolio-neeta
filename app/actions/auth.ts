"use server";

import { revalidatePath } from "next/cache";

import {
	clearAuthCookie,
	setAuthCookie,
} from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { loginSchema } from "@/lib/validators";
import { loginUser } from "@/services/auth";
import type { AuthUser, LoginPayload } from "@/types/auth";

type ActionResult<T> =
	| { data: T; error?: never }
	| { data?: never; error: string };

function getErrorMessage(error: unknown, fallback: string) {
	if (error instanceof AppError) return error.message;
	if (error instanceof Error) return error.message;
	return fallback;
}

export async function loginAction(
	payload: LoginPayload,
): Promise<ActionResult<AuthUser>> {
	try {
		const input = loginSchema.parse(payload);
		const result = await loginUser(input);
		await setAuthCookie(result.token);
		revalidatePath("/", "layout");
		return {
			data: {
				id: result.user.id,
				name: result.user.username,
				username: result.user.username,
			},
		};
	} catch (error) {
		return {
			error: getErrorMessage(
				error,
				"Invalid credentials. Please try again.",
			),
		};
	}
}

export async function logoutAction(): Promise<
	ActionResult<{ message: string }>
> {
	try {
		await clearAuthCookie();
		revalidatePath("/", "layout");
		return { data: { message: "Logged out" } };
	} catch (error) {
		return {
			error: getErrorMessage(error, "Unable to log out."),
		};
	}
}
