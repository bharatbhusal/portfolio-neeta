import { ProjectRequestModel } from "@/models/projectRequest";
import type { ProjectRequest } from "@/types/portfolio";
import type { SortOrder } from "mongoose";

export async function createRequest(
	data: Record<string, unknown>,
) {
	const doc = await ProjectRequestModel.create(data);
	return doc.toObject();
}

export async function findAllRequests() {
	return ProjectRequestModel.find()
		.sort({ createdAt: -1 })
		.lean<ProjectRequest[]>();
}

export async function findRequestById(id: string) {
	return ProjectRequestModel.findById(id).lean<ProjectRequest | null>();
}

export async function updateRequestById(
	id: string,
	data: Partial<Record<string, unknown>>,
) {
	return ProjectRequestModel.findByIdAndUpdate(id, data, {
		new: true,
	}).lean<ProjectRequest | null>();
}

export async function countRequests(
	filter: Record<string, unknown> = {},
) {
	return ProjectRequestModel.countDocuments(filter);
}

export async function findRequestsByFilter(
	filter: Record<string, unknown> = {},
	options: {
		limit?: number;
		skip?: number;
		sort?: Record<string, SortOrder>;
	} = {},
) {
	const query =
		ProjectRequestModel.find(filter).lean<ProjectRequest[]>();

	if (options.sort) query.sort(options.sort);
	if (typeof options.skip === "number") query.skip(options.skip);
	if (typeof options.limit === "number")
		query.limit(options.limit);

	return query.exec();
}

type RequestStats = {
	total: number;
	pending: number;
	reviewed: number;
	accepted: number;
	declined: number;
	logoDesignCount: number;
};

export async function getRequestStats(): Promise<RequestStats> {
	const [total, pending, reviewed, accepted, declined, logoDesignCount] =
		await Promise.all([
			ProjectRequestModel.countDocuments(),
			ProjectRequestModel.countDocuments({ status: "pending" }),
			ProjectRequestModel.countDocuments({ status: "reviewed" }),
			ProjectRequestModel.countDocuments({ status: "accepted" }),
			ProjectRequestModel.countDocuments({ status: "declined" }),
			ProjectRequestModel.countDocuments({
				requestType: "logo_design",
			}),
		]);

	return {
		total,
		pending,
		reviewed,
		accepted,
		declined,
		logoDesignCount,
	};
}
