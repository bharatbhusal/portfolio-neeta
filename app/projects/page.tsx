import { ProjectGrid } from "@/components/sections/project-grid";
import {
	getCategoriesController,
	getProjectsWithPaginationController,
} from "@/controllers/projects";
import { getJson } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import type { SiteData } from "@/types/portfolio";

type ProjectsPageProps = {
	searchParams: Promise<{
		page?: string;
		category?: string;
		q?: string;
	}>;
};

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
	const filter: Record<string, unknown> = {};

	if (category !== "All") {
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

	const [initialProjectsData, initialCategories] =
		await Promise.all([
			getProjectsWithPaginationController(filter, page, 9),
			getCategoriesController(),
		]);

	return (
		<main className="pb-8 lg:pb-12">
			<ProjectGrid
				initialPage={page}
				initialQuery={q}
				initialCategory={category}
				basePath="/projects"
				title="Explore the full archive"
				description="Filter by category to review branding, editorial, product, and motion work."
				initialProjectsData={initialProjectsData}
				initialCategories={initialCategories}
			/>
		</main>
	);
}
