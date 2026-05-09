import { headers } from "next/headers";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

async function getOrigin() {
	const headerList = await headers();
	const protocol = headerList.get("x-forwarded-proto") ?? "http";
	const host =
		headerList.get("x-forwarded-host") ??
		headerList.get("host") ??
		"localhost:3000";

	return `${protocol}://${host}`;
}

export async function GET() {
	const vcardUrl = `${await getOrigin()}/api/vcard`;
	const svg = await QRCode.toString(vcardUrl, {
		type: "svg",
		margin: 1,
		width: 256,
	});

	return new NextResponse(svg, {
		headers: {
			"Content-Type": "image/svg+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
