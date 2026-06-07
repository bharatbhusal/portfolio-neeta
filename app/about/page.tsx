import { About } from "@/components/sections/about";
import { getFeaturedProjectsController } from "@/controllers/projects";
import { fetchJson } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { SiteData } from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/site.json");

	return buildPageMetadata(site, {
		title: "About | Neeta Bhusal",
		description:
			"Learn about the design philosophy, vision, mission, and creative direction.",
		path: "/about",
	});
}

export default async function AboutPage() {
	const [site, featuredProjects] = await Promise.all([
		fetchJson<SiteData>("/site.json"),
		getFeaturedProjectsController(3),
	]);

	return <About site={site} featuredProjects={featuredProjects ?? []} />;
}
