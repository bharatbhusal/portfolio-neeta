import { ProjectGridContent } from "../../../components/sections/projects";
import {
	getCategoriesController,
	getProjectsWithPaginationController,
} from "@/controllers/projects";
import { getJson } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import type { SiteData } from "@/types/portfolio";

export type SortBy = "createdAt" | "title";
export type SortOrder = "asc" | "desc";

type ProjectsPageProps = {
	searchParams: Promise<{
		page?: string;
		category?: string;
		q?: string;
		featured?: string;
		client?: string;
		sortBy?: string;
		sortOrder?: string;
	}>;
};

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildProjectFilter(
	category?: string,
	q?: string,
	featured?: string,
	client?: string,
): Record<string, unknown> {
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
	if (featured === "true") {
		filter.featured = true;
	}
	if (client === "true") {
		filter.client = { $exists: true, $ne: "" };
	}
	return filter;
}

function parseSortBy(value: string | undefined): SortBy {
	switch (value) {
		case "title":
			return "title";
		default:
			return "createdAt";
	}
}

function parseSortOrder(
	value: string | undefined,
): SortOrder {
	return value === "asc" ? "asc" : "desc";
}

export async function generateMetadata() {
	const site = await getJson<SiteData>("/site.json");

	return buildPageMetadata(site, {
		title: "Projects | Neeta Bhusal",
		description:
			"Browse the full selection of portfolio projects, organized by category.",
		path: "/projects",
	});
}

export default async function ProjectsPage({
	searchParams,
}: ProjectsPageProps) {
	const params = await searchParams;
	const page =
		Number(params.page) > 0 ? Number(params.page) : 1;
	const category = params.category ?? "All";
	const q = params.q?.trim();
	const featured = params.featured;
	const client = params.client;
	const sortBy = parseSortBy(params.sortBy);
	const sortOrder = parseSortOrder(params.sortOrder);

	const filter = buildProjectFilter(
		category,
		q,
		featured,
		client,
	);

	const [projectsData, categories] = await Promise.all([
		getProjectsWithPaginationController(filter, page, 9, {
			sortBy,
			sortOrder,
		}),
		getCategoriesController(),
	]);

	return (
		<ProjectGridContent
			projects={projectsData.projects}
			categories={categories}
			pagination={projectsData.pagination}
			basePath="/projects"
			currentCategory={category}
			currentQuery={q ?? ""}
			currentSortBy={sortBy}
			currentSortOrder={sortOrder}
			currentFeatured={featured === "true"}
			currentClient={client === "true"}
		/>
	);
}
