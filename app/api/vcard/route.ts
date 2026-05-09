import { NextResponse } from "next/server";

import { fetchJson } from "@/lib/data";
import type {
	ContactData,
	SiteData,
} from "@/types/portfolio";

function splitName(name: string) {
	const parts = name.trim().split(/\s+/);
	const given =
		parts.slice(0, -1).join(" ") || parts[0] || "";
	const family =
		parts.length > 1 ? parts[parts.length - 1] : "";

	return { given, family };
}

export async function GET() {
	const [site, contact] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<ContactData>("/data/contact.json"),
	]);

	const { given, family } = splitName(site.name);
	const vcard = [
		"BEGIN:VCARD",
		"VERSION:3.0",
		`N:${family};${given};;;`,
		`FN:${site.name}`,
		`ORG:${site.role}`,
		`TEL;TYPE=CELL:${site.phone}`,
		`EMAIL;TYPE=INTERNET:${site.email}`,
		`ADR;TYPE=HOME:;;${site.location};;;;`,
		`URL:${site.seo.url}`,
		"END:VCARD",
		"",
	].join("\r\n");

	return new NextResponse(vcard, {
		headers: {
			"Content-Type": "text/vcard; charset=utf-8",
			"Content-Disposition": `attachment; filename="${contact.vcard.filename}"`,
			"Cache-Control": "no-store",
			"X-Content-Type-Options": "nosniff",
		},
	});
}
