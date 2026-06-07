import { createProjectController } from "@/controllers/projects";
import { ProjectInputSchema } from "@/lib/validators";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { getAuthPayload } from "@/lib/auth";

export async function POST(request: Request) {
	try {
		await getAuthPayload();

		const payload = await request.json().catch(() => null);
		const parsed = ProjectInputSchema.safeParse(payload);
		if (!parsed.success) {
			throw parsed.error;
		}

		const created = await createProjectController(
			parsed.data,
		);
		return successResponse(created, 201, {
			revalidate: false, // Don't cache POST responses
		});
	} catch (error) {
		return errorResponse(error);
	}
}
