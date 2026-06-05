import { cache } from "react";
import siteData from "@/public/site.json";
import type { SiteData } from "@/types/portfolio";

export const getSiteData = cache(async (): Promise<SiteData> => {
	return siteData as SiteData;
});

export function toPositiveInt(
	value: string | null,
	fallback: number,
) {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0
		? parsed
		: fallback;
}
