import { About } from "@/components/sections/about";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ProjectsData,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: "About | Neeta Bhusal",
		description:
			"Learn about the design philosophy, vision, mission, and creative direction.",
		path: "/about",
	});
}

export default async function AboutPage() {
	const [site, projects] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<ProjectsData>("/data/projects.json"),
	]);
	const featuredProjects = projects.projects
		.filter((project) => project.featured)
		.slice(0, 3);

	return (
		<main className="pb-8 lg:pb-12">
			<About site={site} featuredProjects={featuredProjects} />
		</main>
	);
}
