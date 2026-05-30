import { fetchJson } from "@/lib/data";
import { SiteData } from "@/types/portfolio";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const site = await fetchJson<SiteData>("/site.json");
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
