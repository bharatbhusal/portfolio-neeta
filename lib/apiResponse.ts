import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AppError } from "@/lib/errors";

export interface CacheOptions {
	revalidate?: number | false;
	isPrivate?: boolean;
}

export function successResponse<T>(
	data: T,
	status = 200,
	cacheOptions?: CacheOptions,
): NextResponse {
	const headers: Record<string, string> = {};

	if (cacheOptions) {
		if (cacheOptions.revalidate === false) {
			// No caching
			headers["Cache-Control"] = "no-store";
		} else if (typeof cacheOptions.revalidate === "number") {
			// Cache with revalidation time
			const visibility = cacheOptions.isPrivate
				? "private"
				: "public";
			headers["Cache-Control"] =
				`${visibility}, max-age=${cacheOptions.revalidate}, stale-while-revalidate=604800`;
		} else {
			// Default: cache for 1 hour
			const visibility = cacheOptions.isPrivate
				? "private"
				: "public";
			headers["Cache-Control"] = `${visibility}, max-age=3600`;
		}
	}

	return NextResponse.json(
		{ success: true, data },
		{ status, headers },
	);
}

export function errorResponse(
	error: unknown,
): NextResponse {
	if (error instanceof ZodError) {
		return NextResponse.json(
			{
				success: false,
				error: {
					message: "Validation failed",
					code: "VALIDATION_ERROR",
					details: error.flatten(),
				},
			},
			{ status: 400 },
		);
	}

	if (error instanceof AppError) {
		return NextResponse.json(
			{
				success: false,
				error: {
					message: error.message,
					code: error.code,
					details: error.details,
				},
			},
			{ status: error.statusCode },
		);
	}

	const message =
		error instanceof Error
			? error.message
			: "Something went wrong";
	return NextResponse.json(
		{
			success: false,
			error: {
				message,
			},
		},
		{ status: 500 },
	);
}
