import { ProjectGrid } from "@/components/sections/project-grid";
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

	return (
		<ProjectGrid
			initialPage={page}
			initialQuery={q}
			initialCategory={category}
			basePath="/projects"
		/>
	);
}
