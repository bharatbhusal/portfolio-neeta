import { hydrateProject } from "@/lib/projectAssets";
import { ProjectModel } from "@/models/project";
import type { PaginatedProjectsData } from "@/types/portfolio";
import type { SortOrder } from "mongoose";
import {
	findProjectByKey,
	findProjectById,
	findProjectsByFilter,
	countProjects,
	getProjectStats,
	updateProjectById,
	deleteProjectById,
} from "@/repositories/project";

export async function getFeaturedProjects(count = 3) {
	return findProjects(
		{ featured: true },
		{ sort: { createdAt: -1 as SortOrder }, limit: count },
	);
}

export async function getClientProjects(count = 4) {
	return findProjects(
		{ client: { $exists: true, $ne: "" } },
		{ sort: { createdAt: -1 as SortOrder }, limit: count },
	);
}

export async function getProjectByKey(key: string) {
	const project = await findProjectByKey(key);
	return project ? hydrateProject(project) : null;
}

export async function getProjectById(id: string) {
	const project = await findProjectById(id);
	return project ? hydrateProject(project) : null;
}

export async function findProjects(
	filter: Record<string, unknown> = {},
	options: {
		limit?: number;
		skip?: number;
		sort?: Record<string, SortOrder>;
	} = {},
) {
	const docs = await findProjectsByFilter(filter, options);
	return (docs || []).map((p) => hydrateProject(p));
}

function buildSortOption(sort?: {
	sortBy: "createdAt" | "title";
	sortOrder: "asc" | "desc";
}): Record<string, SortOrder> {
	if (!sort) {
		return { createdAt: -1 as SortOrder };
	}
	const order: SortOrder = sort.sortOrder === "asc" ? 1 : -1;
	switch (sort.sortBy) {
		case "title":
			return { title: order };
		case "createdAt":
		default:
			return { createdAt: order };
	}
}

export async function getProjectsWithPagination(
	filter: Record<string, unknown> = {},
	page: number = 1,
	pageSize: number = 9,
	sort?: {
		sortBy: "createdAt" | "title";
		sortOrder: "asc" | "desc";
	},
): Promise<PaginatedProjectsData> {
	const total = await countProjects(filter);

	const totalPages = Math.max(
		1,
		Math.ceil(total / pageSize),
	);
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * pageSize;

	const projects = await findProjects(filter, {
		sort: buildSortOption(sort),
		skip: start,
		limit: pageSize,
	});

	return {
		projects,
		pagination: {
			page: safePage,
			pageSize,
			total,
			totalPages,
		},
	};
}

export async function createProject(
	data: Record<string, unknown>,
) {
	const project = (
		await ProjectModel.create(data)
	).toObject();

	return project;
}

export async function updateProjectService(
	id: string,
	data: Record<string, unknown>,
) {
	const project = await updateProjectById(id, data);
	return project;
}

export async function getProjectStatsService() {
	return getProjectStats();
}

export async function deleteProjectService(id: string) {
	return deleteProjectById(id);
}

const projectsService = {
	getFeaturedProjects,
	getClientProjects,
	getProjectByKey,
	getProjectById,
	findProjects,
	getProjectsWithPagination,
	createProject,
	updateProjectService,
	deleteProjectService,
};

export default projectsService;
