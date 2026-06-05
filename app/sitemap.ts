import { getSiteData } from "@/lib/data";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const site = await getSiteData();
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
