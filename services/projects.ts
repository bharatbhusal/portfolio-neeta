import { hydrateProject } from "@/lib/projectAssets";
import { ProjectModel } from "@/models/project";
import type {
	Project,
	PaginatedProjectsData,
} from "@/types/portfolio";
import type { SortOrder } from "mongoose";
import {
	findClientProjectsSample,
	findFeaturedProjectsSample,
	findProjectByKey,
	findProjectById,
	findProjectsByFilter,
	countProjects,
	getDistinctCategories,
	updateProjectById,
	deleteProjectById,
} from "@/repositories/project";

export async function getFeaturedProjects(count = 3) {
	const docs = await findFeaturedProjectsSample(count);

	const projects = (docs as Project[]).map((p) =>
		hydrateProject(p),
	);
	return projects;
}

export async function getRandomFeaturedProject(
	count: number,
) {
	const items = await getFeaturedProjects(count);
	return items.length ? items[0] : null;
}

export async function getClientProjects(count = 4) {
	const docs = await findClientProjectsSample(count);

	const projects = (docs as Project[]).map((p) =>
		hydrateProject(p),
	);
	return projects;
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

export async function getProjectsWithPagination(
	filter: Record<string, unknown> = {},
	page: number = 1,
	pageSize: number = 9,
): Promise<PaginatedProjectsData> {
	const [total, categories] = await Promise.all([
		countProjects(filter),
		getDistinctCategories(),
	]);

	const totalPages = Math.max(
		1,
		Math.ceil(total / pageSize),
	);
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * pageSize;

	const projects = await findProjects(filter, {
		sort: { featured: -1, key: 1 },
		skip: start,
		limit: pageSize,
	});

	return {
		projects,
		categories: [
			"All",
			...Array.from(
				new Set(categories.filter((each) => !!each)),
			).sort(),
		],
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

export async function deleteProjectService(id: string) {
	return deleteProjectById(id);
}

const projectsService = {
	getFeaturedProjects,
	getRandomFeaturedProject,
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
