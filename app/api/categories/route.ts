import { getCategoriesController } from "@/controllers/projects";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";

export async function GET() {
	try {
		const categories = await getCategoriesController();
		return successResponse(categories, 200, {
			revalidate: false,
		});
	} catch (error) {
		return errorResponse(error);
	}
}
