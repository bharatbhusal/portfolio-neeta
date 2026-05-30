import { Hero } from "@/components/sections/hero";
import { fetchJson } from "@/lib/data";
import { SiteData } from "@/types/portfolio";

export default async function HomePage() {
	const site = await fetchJson<SiteData>("/site.json");

	return (
		<main className="space-y-6 pb-8 lg:space-y-10">
			<Hero site={site} />
		</main>
	);
}
