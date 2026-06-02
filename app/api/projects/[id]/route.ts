import { NextRequest } from "next/server";

import {
	updateProjectController,
	deleteProjectController,
	getProjectByIdController,
} from "@/controllers/projects";
import { ProjectUpdateSchema } from "@/lib/validators";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { getAuthPayload } from "@/lib/auth";
import { AppError } from "@/lib/errors";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

export async function GET(
	request: NextRequest,
	{ params }: RouteContext,
) {
	try {
		const { id } = await params;

		const project = await getProjectByIdController(id);

		return successResponse(project, 200, {
			revalidate: false,
		});
	} catch (error) {
		return errorResponse(error);
	}
}

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
			throw new AppError("Invalid project payload", 400);
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

export async function DELETE(
	request: NextRequest,
	{ params }: RouteContext,
) {
	try {
		await getAuthPayload();

		const { id } = await params;

		const deleted = await deleteProjectController(id);

		return successResponse(
			{
				deleted: true,
				key: deleted.key,
			},
			200,
			{
				revalidate: false,
			},
		);
	} catch (error) {
		return errorResponse(error);
	}
}
