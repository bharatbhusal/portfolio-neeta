import { getClientProjectsController } from "@/controllers/projects";
import { successResponse } from "@/lib/apiResponse";
import { toPositiveInt } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const count = toPositiveInt(searchParams.get("count"), 4);

	const results = await getClientProjectsController(count);

	return successResponse(results, 200, {
		revalidate: false,
	});
}
