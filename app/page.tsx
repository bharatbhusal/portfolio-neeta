import { Hero } from "@/components/sections/hero";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ProjectsData,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: site.seo.title,
		description: site.seo.description,
		path: "/",
	});
}

export default async function HomePage() {
	const [site, projects] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<ProjectsData>("/data/projects.json"),
	]);

	const featuredProjects = projects.projects
		.filter((project) => project.featured)
		.slice(0, 3);

	return (
		<main className="space-y-6 pb-8 lg:space-y-10">
			<Hero
				site={site}
				featuredProject={featuredProjects[0]}
			/>
		</main>
	);
}
