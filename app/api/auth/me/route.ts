import { getAuthPayload } from "@/lib/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { findUserById } from "@/repositories/user";

export async function GET() {
	try {
		await connectToDatabase();
		const auth = await getAuthPayload();
		const user = await findUserById(auth.userId);

		if (!user) {
			throw new AppError("User not found", 404, "NOT_FOUND");
		}

		return successResponse(
			{
				id: user._id.toString(),
				username: user.username,
			},
			200,
			{
				revalidate: false, // Don't cache authenticated user data
				isPrivate: true,
			},
		);
	} catch (error) {
		return errorResponse(error);
	}
}
