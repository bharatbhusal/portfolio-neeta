import { Hero } from "@/components/sections/hero";
import { getCachedSiteData } from "@/lib/data";

export const revalidate = 3600;

export default async function HomePage() {
	const site = await getCachedSiteData();

	return <Hero site={site} />;
}
