import { About } from "@/components/sections/about";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson, fetchJsonNoStore } from "@/lib/data";
import type {
	FeaturedProjectsResponse,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/api/site");

	return buildPageMetadata(site, {
		title: "About | Neeta Bhusal",
		description:
			"Learn about the design philosophy, vision, mission, and creative direction.",
		path: "/about",
	});
}

export default async function AboutPage() {
	const [site, featured] = await Promise.all([
		fetchJson<SiteData>("/api/site"),
		fetchJsonNoStore<FeaturedProjectsResponse>(
			"/api/featured-projects?count=3",
		),
	]);
	const featuredProjects = featured.projects;

	return (
		<main className="pb-8 lg:pb-12">
			<About site={site} featuredProjects={featuredProjects} />
		</main>
	);
}
