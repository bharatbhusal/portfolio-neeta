import { isAuthenticated } from "@/lib/server-auth";
import {
	successResponse,
} from "@/lib/apiResponse";

export async function GET() {
	const authed = await isAuthenticated();
	return successResponse({ authenticated: authed });
}
