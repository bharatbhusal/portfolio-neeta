import { NextResponse } from "next/server";

import { readJson } from "@/lib/serverData";
import type { ContactData } from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
	const contact =
		await readJson<ContactData>("contact.json");

	return NextResponse.json(contact, {
		headers: {
			"Cache-Control": "no-store",
		},
	});
}
