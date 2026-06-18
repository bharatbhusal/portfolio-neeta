import { getProjectRequestsWithPaginationController } from "@/controllers/projectRequests";
import { AdminRequestsContent } from "@/components/sections/admin-requests";

export const revalidate = 0;

type AdminRequestsPageProps = {
	searchParams: Promise<{
		page?: string;
		pageSize?: string;
		status?: string;
		q?: string;
		sortBy?: string;
		sortOrder?: string;
	}>;
};

export default async function AdminRequestsPage({
	searchParams,
}: AdminRequestsPageProps) {
	const resolvedParams = await searchParams;

	const page = Math.max(1, Number(resolvedParams.page) || 1);
	const pageSize = Math.min(50, Math.max(1, Number(resolvedParams.pageSize) || 12));
	const status = resolvedParams.status ?? "";
	const q = resolvedParams.q ?? "";
	const sortBy = (resolvedParams.sortBy ||
		"createdAt") as "createdAt" | "name" | "brandName" | "status" | "logoType";
	const sortOrder = (resolvedParams.sortOrder || "desc") as "asc" | "desc";

	const filter: Record<string, unknown> = {};
	if (status && status !== "all") {
		filter.status = status;
	}
	if (q) {
		filter.$or = [
			{ name: { $regex: q, $options: "i" } },
			{ brandName: { $regex: q, $options: "i" } },
			{ email: { $regex: q, $options: "i" } },
		];
	}

	const result = await getProjectRequestsWithPaginationController(
		filter,
		page,
		pageSize,
		{ sortBy, sortOrder },
	);

	return (
		<AdminRequestsContent
			requests={result.requests}
			pagination={result.pagination}
			currentStatus={status}
			currentQuery={q}
			currentSortBy={sortBy}
			currentSortOrder={sortOrder}
		/>
	);
}
