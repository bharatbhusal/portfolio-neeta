import { ProjectModel } from "@/models/project";
import type { Project } from "@/types/portfolio";
import type { SortOrder } from "mongoose";

export async function findFeaturedProjectsSample(
	count: number,
) {
	const docs = await ProjectModel.aggregate([
		{ $match: { featured: true } },
		{ $sample: { size: Math.max(0, count) } },
	]).exec();

	return docs as Project[];
}

export async function findClientProjectsSample(
	count: number,
) {
	const docs = await ProjectModel.aggregate([
		{ $match: { client: { $exists: true, $ne: "" } } },
		{ $sample: { size: Math.max(0, count) } },
	]).exec();

	return docs as Project[];
}

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

export async function projectExistsByKey(
	key: unknown,
	excludeId?: string,
) {
	const filter: Record<string, unknown> = { key };
	if (excludeId) {
		filter._id = { $ne: excludeId };
	}
	return ProjectModel.exists(filter);
}

export async function countProjects(
	filter: Record<string, unknown> = {},
) {
	return ProjectModel.countDocuments(filter);
}

export async function getDistinctCategories() {
	return ProjectModel.distinct("category");
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
