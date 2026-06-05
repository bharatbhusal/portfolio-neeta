import { About } from "@/components/sections/about";
import { getSiteData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { getFeaturedProjects } from "@/services/projects";

export async function generateMetadata() {
	const site = await getSiteData();

	return buildPageMetadata(site, {
		title: "About | Neeta Bhusal",
		description:
			"Learn about the design philosophy, vision, mission, and creative direction.",
		path: "/about",
	});
}

export default async function AboutPage() {
	const [site, featuredProjects] = await Promise.all([
		getSiteData(),
		getFeaturedProjects(3),
	]);

	return (
		<main className="pb-8 lg:pb-12">
			<About site={site} featuredProjects={featuredProjects} />
		</main>
	);
}
