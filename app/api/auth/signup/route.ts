import { NextRequest } from "next/server";

import { signupController } from "@/controllers/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();
		const user = await signupController(payload);
		return successResponse(user, 201, {
			revalidate: false, // Don't cache POST responses
		});
	} catch (error) {
		return errorResponse(error);
	}
}
