import { getFeaturedProjectsController } from "@/controllers/projects";
import { toPositiveInt } from "@/lib/data";
import { successResponse } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const count = toPositiveInt(searchParams.get("count"), 4);

	const results = await getFeaturedProjectsController(count);

	return successResponse(results, 200, {
		revalidate: 3600, // Cache for 1 hour
	});
}
