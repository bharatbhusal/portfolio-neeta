import { promises as fs } from "fs";
import path from "path";
import { cache } from "react";
import type { SiteData } from "@/types/portfolio";

async function getSiteData(): Promise<SiteData> {
	const filePath = path.join(
		process.cwd(),
		"public",
		"site.json",
	);
	const data = await fs.readFile(filePath, "utf-8");
	return JSON.parse(data) as SiteData;
}

export const getCachedSiteData = cache(getSiteData);
