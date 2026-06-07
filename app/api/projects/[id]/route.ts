import { NextRequest } from "next/server";

import { updateProjectController } from "@/controllers/projects";
import { ProjectUpdateSchema } from "@/lib/validators";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { getAuthPayload } from "@/lib/auth";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

export async function PATCH(
	request: NextRequest,
	{ params }: RouteContext,
) {
	try {
		await getAuthPayload();

		const { id } = await params;

		const payload = await request.json().catch(() => null);

		const parsed = ProjectUpdateSchema.safeParse(payload);

		if (!parsed.success) {
			throw parsed.error;
		}

		const updated = await updateProjectController(
			id,
			parsed.data,
		);

		return successResponse(updated, 200, {
			revalidate: false,
		});
	} catch (error) {
		return errorResponse(error);
	}
}
