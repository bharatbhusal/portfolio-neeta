import { About } from "@/components/sections/about";
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
	const site = await fetchJson<SiteData>("/site.json");
	// const featuredProjects = featured.projects;

	return (
		<main className="pb-8 lg:pb-12">
			{/* <About site={site} featuredProjects={featuredProjects} /> */}
		</main>
	);
}
