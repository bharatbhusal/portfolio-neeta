import { connectToDatabase } from "@/lib/db";
import {
	loginSchema,
	signupSchema,
} from "@/lib/validators";
import { loginUser, registerUser } from "@/services/auth";
import { setAuthCookie } from "@/lib/auth";

export async function signupController(payload: unknown) {
	await connectToDatabase();
	const data = signupSchema.parse(payload);
	const result = await registerUser(data);
	await setAuthCookie(result.token);
	return result.user;
}

export async function loginController(payload: unknown) {
	await connectToDatabase();
	const data = loginSchema.parse(payload);
	const result = await loginUser(data);
	await setAuthCookie(result.token);
	return result.user;
}
