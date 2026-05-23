import { WorkGrid } from "@/components/sections/work-grid";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	PaginatedProjectsData,
	SiteData,
} from "@/types/portfolio";

type ProjectsPageProps = {
	searchParams: Promise<{
		page?: string;
		category?: string;
	}>;
};

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/api/site");

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
	const query = new URLSearchParams({
		page: String(page),
		pageSize: "10",
	});

	if (category !== "All") {
		query.set("category", category);
	}

	const projects = await fetchJson<PaginatedProjectsData>(
		`/api/projects?${query.toString()}`,
	);

	projects.projects = projects.projects.sort((a, b) =>
		a.key.localeCompare(b.key),
	);

	return (
		<main className="pb-8 lg:pb-12">
			<WorkGrid
				projects={projects.projects}
				categories={projects.categories}
				currentCategory={category}
				basePath="/projects"
				pagination={projects.pagination}
				title="Explore the full archive"
				description="Filter by category to review branding, editorial, product, and motion work."
				showFilters
			/>
		</main>
	);
}
