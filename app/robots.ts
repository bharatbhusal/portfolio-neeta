import { getCachedSiteData } from "@/lib/data";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
	const site = await getCachedSiteData();

	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: `${site.seo.url}/sitemap.xml`,
	};
}
