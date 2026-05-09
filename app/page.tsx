import { Hero } from "@/components/sections/hero";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type { SiteData } from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: site.seo.title,
		description: site.seo.description,
		path: "/",
	});
}

export default async function HomePage() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return (
		<main className="space-y-6 pb-8 lg:space-y-10">
			<Hero site={site} />
		</main>
	);
}
