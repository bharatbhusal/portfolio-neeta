import { Hero } from "@/components/sections/hero";
import { fetchJson } from "@/lib/data";
import { SiteData } from "@/types/portfolio";

export default async function HomePage() {
	const site = await fetchJson<SiteData>("/site.json");

	return <Hero site={site} />;
}
