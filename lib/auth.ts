import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { getEnvConfig } from "./env";
import { AppError } from "./errors";

export async function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

export async function comparePassword(
	password: string,
	hash: string,
) {
	return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload): string {
	return jwt.sign(
		payload,
		getEnvConfig().CLOUDINARY_API_SECRET,
	);
}

export function verifyToken(token: string): JwtPayload {
	try {
		return jwt.verify(
			token,
			getEnvConfig().CLOUDINARY_API_SECRET,
		) as JwtPayload;
	} catch {
		throw new AppError(
			"Invalid or expired token",
			401,
			"UNAUTHORIZED",
		);
	}
}

export async function setAuthCookie(
	token: string,
): Promise<void> {
	const { AUTH_COOKIE_NAME, NODE_ENV, JWT_MAX_AGE } =
		getEnvConfig();
	const cookieStore = await cookies();
	cookieStore.set(AUTH_COOKIE_NAME, token, {
		httpOnly: true,
		secure: NODE_ENV === "production",
		sameSite: "lax",
		maxAge: JWT_MAX_AGE,
		path: "/",
	});
}

export async function clearAuthCookie(): Promise<void> {
	const { AUTH_COOKIE_NAME, NODE_ENV } = getEnvConfig();
	const cookieStore = await cookies();
	cookieStore.set(AUTH_COOKIE_NAME, "", {
		httpOnly: true,
		secure: NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
		path: "/",
	});
}

export async function getAuthPayload(): Promise<JwtPayload> {
	const { AUTH_COOKIE_NAME } = getEnvConfig();
	const cookieStore = await cookies();
	const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
	if (!token) {
		throw new AppError(
			"Authentication required",
			401,
			"UNAUTHORIZED",
		);
	}

	return verifyToken(token);
}
