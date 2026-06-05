import { ProjectGrid } from "@/components/sections/project-grid";
import { getSiteData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import {
	buildProjectsFilter,
	getCategories,
	getProjectsWithPagination,
} from "@/services/projects";

type ProjectsPageProps = {
	searchParams: Promise<{
		page?: string;
		category?: string;
		q?: string;
	}>;
};

export async function generateMetadata() {
	const site = await getSiteData();

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
	const [data, categories] = await Promise.all([
		getProjectsWithPagination(
			buildProjectsFilter({ category, q }),
			page,
			9,
		),
		getCategories(),
	]);

	return (
		<main className="pb-8 lg:pb-12">
			<ProjectGrid
				key={`${page}:${category}:${q ?? ""}`}
				data={data}
				categories={categories}
				initialPage={page}
				initialQuery={q}
				initialCategory={category}
				basePath="/projects"
				title="Explore the full archive"
				description="Filter by category to review branding, editorial, product, and motion work."
			/>
		</main>
	);
}
