import {
	createRequest,
	findAllRequests,
	findRequestById,
	findRequestsByFilter,
	countRequests,
	getRequestStats,
	updateRequestById,
} from "@/repositories/projectRequest";
import type { PaginatedProjectRequestsData } from "@/types/portfolio";
import type { SortOrder } from "mongoose";

export async function createProjectRequest(
	data: Record<string, unknown>,
) {
	return createRequest(data);
}

export async function getAllProjectRequests() {
	return findAllRequests();
}

export async function getProjectRequestById(id: string) {
	return findRequestById(id);
}

export async function updateProjectRequest(
	id: string,
	data: Record<string, unknown>,
) {
	return updateRequestById(id, data);
}

export async function getProjectRequestStats() {
	return getRequestStats();
}

function buildSortOption(sort?: {
	sortBy: string;
	sortOrder: "asc" | "desc";
}): Record<string, SortOrder> {
	if (!sort) {
		return { createdAt: -1 as SortOrder };
	}
	const order: SortOrder = sort.sortOrder === "asc" ? 1 : -1;
	switch (sort.sortBy) {
		case "name":
			return { name: order };
		case "brandName":
			return { brandName: order };
		case "status":
			return { status: order };
		case "logoType":
			return { logoType: order };
		case "createdAt":
		default:
			return { createdAt: order };
	}
}

export async function getProjectRequestsWithPagination(
	filter: Record<string, unknown> = {},
	page = 1,
	pageSize = 12,
	sort?: {
		sortBy: string;
		sortOrder: "asc" | "desc";
	},
): Promise<PaginatedProjectRequestsData> {
	const total = await countRequests(filter);

	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * pageSize;

	const requests = await findRequestsByFilter(filter, {
		sort: buildSortOption(sort),
		skip: start,
		limit: pageSize,
	});

	return {
		requests,
		pagination: {
			page: safePage,
			pageSize,
			total,
			totalPages,
		},
	};
}
