import { clearAuthCookie } from "@/lib/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";

export async function POST() {
	try {
		await clearAuthCookie();
		return successResponse({ message: "Logged out" });
	} catch (error) {
		return errorResponse(error);
	}
}
