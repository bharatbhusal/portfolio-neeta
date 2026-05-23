import { NextRequest } from "next/server";

import { getAuthPayload } from "@/lib/auth";
import {
	successResponse,
	errorResponse,
} from "@/lib/apiResponse";
import { createUploadSignature } from "@/lib/cloudinary";
import { AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
	try {
		await getAuthPayload();
		const { searchParams } = new URL(request.url);
		const publicId = searchParams.get("publicId");
		if (!publicId)
			throw new AppError("public Id is required.");
		const signature = createUploadSignature(publicId);
		return successResponse(signature);
	} catch (error) {
		return errorResponse(error);
	}
}
