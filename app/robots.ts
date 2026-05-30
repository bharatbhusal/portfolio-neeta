import { fetchJson } from "@/lib/data";
import { SiteData } from "@/types/portfolio";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const site = await fetchJson<SiteData>("/site.json");

	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${site.seo.url}/sitemap.xml`,
	};
}
