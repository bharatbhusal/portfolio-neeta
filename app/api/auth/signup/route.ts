import { NextRequest } from "next/server";

import { signupController } from "@/controllers/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { isOnboardingDisabled } from "@/services/auth";
import { AppError } from "@/lib/errors";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();
		if (isOnboardingDisabled())
			throw new AppError(
				"Onboarding is disabled at the moment.",
				503,
			);
		const user = await signupController(payload);
		return successResponse(user, 201, {
			revalidate: false, // Don't cache POST responses
		});
	} catch (error) {
		return errorResponse(error);
	}
}
