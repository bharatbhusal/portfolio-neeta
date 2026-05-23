import { NextRequest } from "next/server";

import { loginController } from "@/controllers/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json();
		const user = await loginController(payload);
		return successResponse(user);
	} catch (error) {
		return errorResponse(error);
	}
}
