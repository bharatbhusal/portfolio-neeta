import { WorkGrid } from "@/components/sections/work-grid";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ProjectsData,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: "Work | Neeta Bhusal",
		description:
			"Browse the full selection of portfolio projects, organized by category.",
		path: "/work",
	});
}

export default async function WorkPage() {
	const projects = await fetchJson<ProjectsData>(
		"/data/projects.json",
	);

	return (
		<main className="pb-8 lg:pb-12">
			<WorkGrid
				projects={projects.projects}
				title="Explore the full archive"
				description="Filter by category to review branding, editorial, product, and motion work."
				showFilters
			/>
		</main>
	);
}
