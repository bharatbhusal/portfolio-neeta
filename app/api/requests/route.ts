import { NextRequest } from "next/server";

import { getAuthPayload } from "@/lib/auth";
import {
	createProjectRequestController,
	getProjectRequestsWithPaginationController,
} from "@/controllers/projectRequests";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { getCachedSiteData } from "@/lib/data";
import { sendAdminAlert, sendClientConfirmation } from "@/lib/email";
import {
	ProjectRequestQuerySchema,
	ProjectRequestSchema,
	type ProjectRequestInput,
	type ProjectRequestQuery,
} from "@/lib/validators";

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as Record<
			string,
			unknown
		>;
		const parsed = ProjectRequestSchema.parse(
			body,
		) as ProjectRequestInput;

		const created =
			await createProjectRequestController(parsed);

		try {
			const site = await getCachedSiteData();
			const requestData = created as unknown as Record<string, unknown>;

			await Promise.allSettled([
				sendAdminAlert(requestData, site.email),
				sendClientConfirmation(
					requestData,
					(requestData.email as string) ?? site.email,
				),
			]);
		} catch {
			console.warn("Failed to send email notifications");
		}

		return successResponse(created, 201);
	} catch (error) {
		return errorResponse(error);
	}
}

export async function GET(request: NextRequest) {
	try {
		await getAuthPayload();

		const { searchParams } = request.nextUrl;
		const raw = {
			page: searchParams.get("page") ?? undefined,
			pageSize: searchParams.get("pageSize") ?? undefined,
			status: searchParams.get("status") ?? undefined,
			q: searchParams.get("q") ?? undefined,
			sortBy: searchParams.get("sortBy") ?? undefined,
			sortOrder: searchParams.get("sortOrder") ?? undefined,
		};
		const parsed = ProjectRequestQuerySchema.parse(
			raw,
		) as ProjectRequestQuery;

		const filter: Record<string, unknown> = {};
		if (parsed.status) {
			filter.status = parsed.status;
		}
		if (parsed.q) {
			const regex = new RegExp(
				parsed.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
				"i",
			);
			filter.$or = [
				{ name: regex },
				{ brandName: regex },
				{ email: regex },
			];
		}

		const result =
			await getProjectRequestsWithPaginationController(
				filter,
				parsed.page,
				parsed.pageSize,
				{
					sortBy: parsed.sortBy,
					sortOrder: parsed.sortOrder,
				},
			);

		return successResponse(result);
	} catch (error) {
		return errorResponse(error);
	}
}
