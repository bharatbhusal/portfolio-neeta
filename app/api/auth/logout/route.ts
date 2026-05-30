import { clearAuthCookie } from "@/lib/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";

export async function POST() {
	try {
		await clearAuthCookie();
		return successResponse({ message: "Logged out" }, 200, {
			revalidate: false, // Don't cache POST responses
		});
	} catch (error) {
		return errorResponse(error);
	}
}
