import { connectToDatabase } from "@/lib/db";
import {
	getClientProjects,
	getFeaturedProjects,
	getProjectByKey,
	getProjectById,
	findProjects,
	getProjectsWithPagination,
	createProject,
	updateProjectService,
	deleteProjectService,
} from "@/services/projects";
import { getDistinctCategories } from "@/repositories/project";
import type { SortOrder } from "mongoose";
import { AppError } from "@/lib/errors";
import { ProjectModel } from "@/models/project";

export async function getFeaturedProjectsController(
	count: number,
) {
	await connectToDatabase();
	return getFeaturedProjects(count);
}

export async function getClientProjectsController(
	count: number,
) {
	await connectToDatabase();
	return getClientProjects(count);
}

export async function getProjectByKeyController(
	key: string,
) {
	await connectToDatabase();
	return getProjectByKey(key);
}

export async function getProjectByIdController(id: string) {
	await connectToDatabase();
	return getProjectById(id);
}

export async function findProjectsController(
	filter: Record<string, unknown> = {},
	options: {
		limit?: number;
		skip?: number;
		sort?: Record<string, SortOrder>;
	} = {},
) {
	await connectToDatabase();
	return findProjects(filter, options);
}

export async function getProjectsWithPaginationController(
	filter: Record<string, unknown> = {},
	page: number = 1,
	pageSize: number = 9,
) {
	await connectToDatabase();
	return getProjectsWithPagination(filter, page, pageSize);
}

export async function getCategoriesController() {
	await connectToDatabase();
	const cats = await getDistinctCategories();
	return [
		"All",
		...Array.from(
			new Set(cats.filter((each) => !!each)),
		).sort(),
	];
}

export async function createProjectController(
	data: Record<string, unknown>,
) {
	await connectToDatabase();
	const exists = await ProjectModel.exists({
		key: data.key,
	});
	if (exists) {
		throw new AppError("project already exists", 409);
	}
	return createProject(data);
}

export async function updateProjectController(
	id: string,
	data: Record<string, unknown>,
) {
	await connectToDatabase();
	if (typeof data.key === "string" && data.key.length > 0) {
		const duplicate = await ProjectModel.exists({
			key: data.key,
			_id: { $ne: id },
		});
		if (duplicate) {
			throw new AppError("project already exists", 409);
		}
	}
	const project = await updateProjectService(id, data);
	if (!project) {
		throw new AppError("project not found", 404);
	}
	return project;
}

export async function deleteProjectController(id: string) {
	await connectToDatabase();
	const deleted = await deleteProjectService(id);
	if (!deleted) {
		throw new AppError("project not found", 404);
	}
	return deleted;
}
