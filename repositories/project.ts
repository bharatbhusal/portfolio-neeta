import { ProjectModel } from "@/models/project";
import type { Project } from "@/types/portfolio";
import type { SortOrder } from "mongoose";

export async function findProjectByKey(key: string) {
	return ProjectModel.findOne({
		key,
	}).lean<Project | null>();
}

export async function findProjectById(id: string) {
	return ProjectModel.findById(id).lean<Project | null>();
}

export async function updateProjectById(
	id: string,
	data: Partial<Record<string, unknown>>,
) {
	return ProjectModel.findByIdAndUpdate(id, data, {
		new: true,
	}).lean<Project | null>();
}

export async function deleteProjectById(id: string) {
	return ProjectModel.findByIdAndDelete(
		id,
	).lean<Project | null>();
}

export async function countProjects(
	filter: Record<string, unknown> = {},
) {
	return ProjectModel.countDocuments(filter);
}

export async function getDistinctCategories() {
	return ProjectModel.distinct("category");
}

type ProjectStats = {
	total: number;
	featured: number;
	clientProjects: number;
	categories: number;
};

export async function getProjectStats(): Promise<ProjectStats> {
	const [total, featured, clientProjects, categories] =
		await Promise.all([
			ProjectModel.countDocuments(),
			ProjectModel.countDocuments({ featured: true }),
			ProjectModel.countDocuments({
				client: { $exists: true, $ne: "" },
			}),
			ProjectModel.distinct("category").then(
				(cats) => cats.filter(Boolean).length,
			),
		]);

	return { total, featured, clientProjects, categories };
}

export async function findProjectsByFilter(
	filter: Record<string, unknown> = {},
	options: {
		limit?: number;
		skip?: number;
		sort?: Record<string, SortOrder>;
	} = {},
) {
	const query = ProjectModel.find(filter).lean<Project[]>();

	if (options.sort) query.sort(options.sort);
	if (typeof options.skip === "number")
		query.skip(options.skip);
	if (typeof options.limit === "number")
		query.limit(options.limit);

	return query.exec();
}
