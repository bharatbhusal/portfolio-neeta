import { getEnvConfig } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { errorResponse } from "@/lib/apiResponse";

export const runtime = "nodejs";

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
			`l_text:Arial_52_bold: ${encodeURIComponent(watermark)} `,
		);
		pieces.push("g_south_east");
		pieces.push("x_80");
		pieces.push("y_80");
		pieces.push("o_80");
		pieces.push("co_black");
		pieces.push("b_white");
		pieces.push("r_16");
	}

	return pieces.length > 0
		? pieces.join(",")
		: "f_auto,q_auto";
}

export async function GET(req: Request) {
	try {
		const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_FOLDER_NAME } =
			getEnvConfig();
		const url = new URL(req.url);
		const params = url.searchParams;
		const publicId = params.get("publicId");
		if (!publicId)
			throw new AppError("publicId is required.", 401);

		const transform = buildTransformString(params);
		const encoded = publicId
			.split("/")
			.map((s) => encodeURIComponent(s))
			.join("/");
		const download = params.get("download") === "1";

		const fetchUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${CLOUDINARY_FOLDER_NAME}/${encoded}`;

		const upstream = await fetch(fetchUrl);
		if (!upstream.ok) {
			const upstreamBody = await upstream.text();
			throw new AppError(
				"Cloudinary image request failed.",
				upstream.status,
				undefined,
				upstreamBody.slice(0, 400),
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
		return errorResponse(
			new AppError(
				"Cloudinary search failed.",
				500,
				"CLOUDINARY_ERROR",
				message,
			),
		);
	}
}
