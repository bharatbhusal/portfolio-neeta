import { hydrateProject } from "@/lib/projectAssets";
import { connectToDatabase } from "@/lib/db";
import { AppError } from "@/lib/errors";
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
	updateProjectById,
	deleteProjectById,
	getDistinctCategories,
	projectExistsByKey,
} from "@/repositories/project";

export function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function buildProjectsFilter({
	category,
	q,
}: {
	category?: string;
	q?: string;
}) {
	const filter: Record<string, unknown> = {};
	if (category && category !== "All") {
		filter.category = category;
	}

	if (q) {
		const regex = new RegExp(escapeRegex(q), "i");
		filter.$or = [
			{ title: regex },
			{ category: regex },
			{ summary: regex },
			{ story: regex },
			{ description: regex },
			{ year: regex },
			{ tags: regex },
			{ client: regex },
		];
	}

	return filter;
}

export async function getFeaturedProjects(count = 3) {
	await connectToDatabase();
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
	await connectToDatabase();
	const docs = await findClientProjectsSample(count);

	const projects = (docs as Project[]).map((p) =>
		hydrateProject(p),
	);
	return projects;
}

export async function getProjectByKey(key: string) {
	await connectToDatabase();
	const project = await findProjectByKey(key);
	return project ? hydrateProject(project) : null;
}

export async function getProjectById(id: string) {
	await connectToDatabase();
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
	await connectToDatabase();
	const docs = await findProjectsByFilter(filter, options);
	return (docs || []).map((p) => hydrateProject(p));
}

export async function getProjectsWithPagination(
	filter: Record<string, unknown> = {},
	page: number = 1,
	pageSize: number = 9,
): Promise<PaginatedProjectsData> {
	await connectToDatabase();
	const total = await countProjects(filter);

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
	await connectToDatabase();
	const exists = await projectExistsByKey(data.key);
	if (exists) {
		throw new AppError("project already exists", 409);
	}

	const project = (
		await ProjectModel.create(data)
	).toObject();

	return hydrateProject(project as Project);
}

export async function updateProjectService(
	id: string,
	data: Record<string, unknown>,
) {
	await connectToDatabase();
	if (typeof data.key === "string" && data.key.length > 0) {
		const duplicate = await projectExistsByKey(data.key, id);
		if (duplicate) {
			throw new AppError("project already exists", 409);
		}
	}

	const project = await updateProjectById(id, data);
	if (!project) {
		throw new AppError("project not found", 404);
	}
	return hydrateProject(project);
}

export async function deleteProjectService(id: string) {
	await connectToDatabase();
	const deleted = await deleteProjectById(id);
	if (!deleted) {
		throw new AppError("project not found", 404);
	}
	return hydrateProject(deleted);
}

export async function getCategories() {
	await connectToDatabase();
	const cats = await getDistinctCategories();
	return [
		"All",
		...Array.from(
			new Set(cats.filter((each) => !!each)),
		).sort(),
	];
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
	getCategories,
	buildProjectsFilter,
};

export default projectsService;
