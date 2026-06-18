import { NextRequest } from "next/server";

import { updateProjectRequestController } from "@/controllers/projectRequests";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getAuthPayload } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import { sendStatusUpdateEmail } from "@/lib/email";
import {
	ProjectRequestUpdateSchema,
	type ProjectRequestUpdate,
} from "@/lib/validators";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		await getAuthPayload();

		const { id } = await params;
		const body = (await request.json()) as Record<string, unknown>;
		const parsed = ProjectRequestUpdateSchema.parse(
			body,
		) as ProjectRequestUpdate;

		const updated = await updateProjectRequestController(id, parsed);

		if (!updated) {
			throw new AppError("Project request not found", 404);
		}

		try {
			const requestData = updated as Record<string, unknown>;
			const clientEmail = requestData.email as string;
			if (clientEmail) {
				await sendStatusUpdateEmail(requestData, clientEmail);
			}
		} catch {
			console.warn("Failed to send status update email");
		}

		return successResponse(updated);
	} catch (error) {
		return errorResponse(error);
	}
}
