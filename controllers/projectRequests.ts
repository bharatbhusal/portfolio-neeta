import { connectToDatabase } from "@/lib/db";
import {
	createProjectRequest,
	getAllProjectRequests,
	getProjectRequestById,
	getProjectRequestStats,
	getProjectRequestsWithPagination,
	updateProjectRequest,
} from "@/services/projectRequests";

function serialize<T>(data: T): T {
	return JSON.parse(JSON.stringify(data));
}

export async function createProjectRequestController(
	data: Record<string, unknown>,
) {
	await connectToDatabase();
	const result = await createProjectRequest(data);
	return serialize(result);
}

export async function getAllProjectRequestsController() {
	await connectToDatabase();
	const result = await getAllProjectRequests();
	return serialize(result ?? []);
}

export async function getProjectRequestByIdController(
	id: string,
) {
	await connectToDatabase();
	const result = await getProjectRequestById(id);
	return serialize(result);
}

export async function updateProjectRequestController(
	id: string,
	data: Record<string, unknown>,
) {
	await connectToDatabase();
	const result = await updateProjectRequest(id, data);
	return serialize(result);
}

export async function getProjectRequestsWithPaginationController(
	filter: Record<string, unknown> = {},
	page = 1,
	pageSize = 12,
	sort?: {
		sortBy: "createdAt" | "name" | "brandName" | "status" | "logoType";
		sortOrder: "asc" | "desc";
	},
) {
	await connectToDatabase();
	const result = await getProjectRequestsWithPagination(
		filter,
		page,
		pageSize,
		sort,
	);
	return serialize(result);
}

export async function getProjectRequestStatsController() {
	await connectToDatabase();
	const result = await getProjectRequestStats();
	return serialize(result);
}
