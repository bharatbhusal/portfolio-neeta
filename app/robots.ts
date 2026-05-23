import type { MetadataRoute } from "next";

import { fetchJson } from "@/lib/data";
import type { SiteData } from "@/types/portfolio";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const site = await fetchJson<SiteData>("/api/site");

	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${site.seo.url}/sitemap.xml`,
	};
}
