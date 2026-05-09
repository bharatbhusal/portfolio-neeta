import { NextResponse } from "next/server";

import projectsData from "@/public/data/projects.json";
import type { Project } from "@/types/portfolio";

const DEFAULT_PAGE_SIZE = 9;

function toPositiveInt(
	value: string | null,
	fallback: number,
) {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0
		? parsed
		: fallback;
}

function buildImageUrl(
	publicId: string,
	cloudName: string,
) {
	const encoded = publicId
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");

	return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,w_1200,h_900/portfolio_neeta/${encoded}`;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const page = toPositiveInt(searchParams.get("page"), 1);
	const pageSize = Math.min(
		toPositiveInt(
			searchParams.get("pageSize"),
			DEFAULT_PAGE_SIZE,
		),
		DEFAULT_PAGE_SIZE,
	);
	const category = searchParams.get("category");

	const projects = (
		projectsData.projects as Project[]
	).filter((project) =>
		category && category !== "All"
			? project.category === category ||
				project.tags.includes(category)
			: true,
	);
	const categories = [
		"All",
		...Array.from(
			new Set(
				(projectsData.projects as Project[]).map(
					(project) => project.category,
				),
			),
		),
	];
	const total = projects.length;
	const totalPages = Math.max(
		1,
		Math.ceil(total / pageSize),
	);
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * pageSize;
	const items = projects.slice(start, start + pageSize);
	const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

	const results = items.map((project) => {
		const imageUrl = cloudName
			? buildImageUrl(project.key, cloudName)
			: `/api/images?publicId=${encodeURIComponent(project.key)}&w=1200&h=900&crop=fill&format=auto&q=auto`;

		return {
			...project,
			imageUrl,
			downloadUrl: `/api/images?publicId=${encodeURIComponent(project.key)}&download=1&watermark=${encodeURIComponent("Neeta Bhusal")}`,
		};
	});

	return NextResponse.json({
		projects: results,
		categories,
		pagination: {
			page: safePage,
			pageSize,
			total,
			totalPages,
		},
	});
}
