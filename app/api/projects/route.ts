import {
	getProjectsWithPaginationController,
	createProjectController,
} from "@/controllers/projects";
import { ProjectInputSchema } from "@/lib/validators";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";

import { toPositiveInt } from "@/lib/data";

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = toPositiveInt(searchParams.get("page"), 1);
		const pageSize = Math.min(
			toPositiveInt(searchParams.get("pageSize"), 9),
			9,
		);
		const category = searchParams.get("category");
		const q = searchParams.get("q")?.trim();

		const filter: Record<string, unknown> = {};
		if (category && category !== "All") {
			filter.category = category;
		}

		if (q) {
			const regex = new RegExp(escapeRegex(q), "i");
			filter.$or = [
				{ title: regex },
				{ category: regex },
				{ summary: regex },
				{ story: regex },
				{ description: regex },
				{ year: regex },
				{ tags: regex },
				{ client: regex },
			];
		}

		const response =
			await getProjectsWithPaginationController(
				filter,
				page,
				pageSize,
			);
		return successResponse(response, 200, {
			revalidate: 3600, // Cache for 1 hour
		});
	} catch (error) {
		return errorResponse(error);
	}
}

export async function POST(request: Request) {
	try {
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
