import { NextResponse } from "next/server";

import { readJson } from "@/lib/serverData";
import type { SiteData } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
	const site = await readJson<SiteData>("site.json");

	return NextResponse.json(site, {
		headers: {
			"Cache-Control": "no-store",
		},
	});
}
