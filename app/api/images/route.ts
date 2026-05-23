/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import * as cloudinary from "cloudinary";

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

function buildTransformString(params: URLSearchParams) {
	const pieces: string[] = [];
	const w = params.get("w");
	const h = params.get("h");
	const c = params.get("crop");
	const q = params.get("q");
	const f = params.get("format");
	const watermark = params.get("watermark");

	if (w) pieces.push(`w_${w}`);
	if (h) pieces.push(`h_${h}`);
	if (c) pieces.push(`c_${c}`);
	if (q) pieces.push(`q_${q}`);
	if (f) pieces.push(`f_${f}`);
	if (watermark) {
		pieces.push(
			`l_text:Arial_52_bold:${encodeURIComponent(watermark)}`,
		);
		pieces.push("g_south_east");
		pieces.push("x_60");
		pieces.push("y_60");
		pieces.push("o_80");
		pieces.push("co_white");
	}

	return pieces.length > 0
		? pieces.join(",")
		: "f_auto,q_auto";
}

export async function GET(req: Request) {
	const url = new URL(req.url);
	const params = url.searchParams;
	const publicId = params.get("publicId");
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
	const uploadFolder = "portfolio_neeta";

	if (!cloudName) {
		return NextResponse.json(
			{
				error: "Missing Cloudinary cloud name configuration.",
			},
			{ status: 500 },
		);
	}

	// If a publicId is provided, proxy the image from Cloudinary (with optional transforms)
	if (publicId) {
		const transform = buildTransformString(params);
		const encoded = publicId
			.split("/")
			.map((s) => encodeURIComponent(s))
			.join("/");
		const download = params.get("download") === "1";

		const fetchUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${uploadFolder}/${encoded}`;

		const upstream = await fetch(fetchUrl);
		if (!upstream.ok) {
			const upstreamBody = await upstream.text();
			return NextResponse.json(
				{
					error: "Cloudinary image request failed.",
					publicId,
					status: upstream.status,
					statusText: upstream.statusText,
					details: upstreamBody.slice(0, 400) || undefined,
				},
				{ status: upstream.status },
			);
		}

		const headers: Record<string, string> = {};
		const ct = upstream.headers.get("content-type");
		if (ct) headers["Content-Type"] = ct;
		if (download) {
			headers["Content-Disposition"] =
				`attachment; filename="${publicId.split("/").pop() ?? "project-image"}"`;
		}

		const buffer = await upstream.arrayBuffer();
		return new Response(buffer, { status: 200, headers });
	}

	// Search / list resources with filters, sorting, pagination
	const q = params.get("q");
	const folder = params.get("folder");
	const tags = params.get("tags");
	const sortField = params.get("sortField") || "created_at";
	const sortOrder = params.get("sortOrder") || "desc";
	const limit = Number(params.get("limit") || 20);
	const nextCursor = params.get("nextCursor") || undefined;

	const exprParts: string[] = [];
	if (q)
		exprParts.push(
			`(public_id:${q} OR tags:${q} OR context.keywords:${q})`,
		);
	if (folder) exprParts.push(`folder:${folder}`);
	if (tags) {
		const tagList = tags
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);
		tagList.forEach((t) => exprParts.push(`tags:${t}`));
	}

	const expression =
		exprParts.length > 0
			? exprParts.join(" AND ")
			: "resource_type:image";

	try {
		// cloudinary.v2.search has incomplete typings for the chainable builder,
		// cast to `any` to avoid TypeScript errors while keeping runtime behavior.
		const builder: any = cloudinary.v2.search;
		let query = builder
			.expression(expression)
			.sort_by(sortField, sortOrder)
			.max_results(limit);
		if (nextCursor) query = query.next_cursor(nextCursor);
		const result = await query.execute();

		const resources = (result.resources || []).map(
			(r: any) => ({
				public_id: r.public_id,
				format: r.format,
				width: r.width,
				height: r.height,
				bytes: r.bytes,
				created_at: r.created_at,
				secure_url: r.secure_url,
				folder: r.folder,
				tags: r.tags,
			}),
		);

		return NextResponse.json({
			resources,
			next_cursor: result.next_cursor || null,
		});
	} catch (err) {
		const asObject =
			err && typeof err === "object"
				? (err as {
						message?: string;
						http_code?: number;
						error?: { message?: string };
					})
				: undefined;
		const message =
			asObject?.error?.message ??
			asObject?.message ??
			String(err);
		return NextResponse.json(
			{
				error: "Cloudinary search failed.",
				details: message,
			},
			{ status: asObject?.http_code ?? 500 },
		);
	}
}
