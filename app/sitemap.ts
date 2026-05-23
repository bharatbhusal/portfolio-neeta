import type { MetadataRoute } from "next";

import { fetchJson } from "@/lib/data";
import type { SiteData } from "@/types/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const site = await fetchJson<SiteData>("/api/site");
	const now = new Date();

	return [
		"",
		"/projects",
		"/about",
		"/profile",
		"/contact",
	].map((path) => ({
		url: `${site.seo.url}${path}`,
		lastModified: now,
		changeFrequency: path === "" ? "weekly" : "monthly",
		priority: path === "" ? 1 : 0.8,
	}));
}
