import { About } from "@/components/sections/about";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ArtworksData,
	PhotographyData,
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
	const [site, artworks, photography] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<ArtworksData>("/data/artworks.json"),
		fetchJson<PhotographyData>("/data/photography.json"),
	]);

	return (
		<main className="pb-8 lg:pb-12">
			<About
				site={site}
				artworks={artworks.artworks}
				photographs={photography.photographs}
			/>
		</main>
	);
}
