import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/models/project";
import { ProjectInputSchema } from "@/lib/validators";
import { hydrateProject } from "@/lib/projectAssets";
import type {
	PaginatedProjectsData,
	Project,
} from "@/types/portfolio";
import { getAuthPayload } from "@/lib/auth";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { AppError } from "@/lib/errors";

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

function escapeRegex(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
	try {
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
		const q = searchParams.get("q")?.trim();

		await connectToDatabase();
		const filter: Record<string, unknown> = {};
		if (category && category !== "All") {
			filter.category = category;
		}

		if (q) {
			const regex = new RegExp(escapeRegex(q), "i");
			filter.$or = [
				{ title: regex },
				{ category: regex },
				{ summary: regex },
				{ story: regex },
				{ description: regex },
				{ year: regex },
				{ tags: regex },
				{ client: regex },
			];
		}

		const [total, categories] = await Promise.all([
			ProjectModel.countDocuments(filter),
			ProjectModel.distinct("category"),
		]);

		const totalPages = Math.max(
			1,
			Math.ceil(total / pageSize),
		);
		const safePage = Math.min(page, totalPages);
		const start = (safePage - 1) * pageSize;

		const projects = await ProjectModel.find(filter)
			.sort({ featured: -1, key: 1 })
			.skip(start)
			.limit(pageSize)
			.lean<Project[]>();

		const results = projects.map((project) =>
			hydrateProject(project),
		);

		const response: PaginatedProjectsData = {
			projects: results,
			categories: [
				"All",
				...Array.from(new Set(categories)).sort(),
			],
			pagination: {
				page: safePage,
				pageSize,
				total,
				totalPages,
			},
		};
		return successResponse(response);
	} catch (error) {
		return errorResponse(error);
	}
}

export async function POST(request: Request) {
	try {
		await getAuthPayload();

		const payload = await request.json().catch(() => null);
		const parsed = ProjectInputSchema.safeParse(payload);
		if (!parsed.success) {
			throw new AppError("Invalid project payload", 400);
		}

		await connectToDatabase();
		const exists = await ProjectModel.exists({
			key: parsed.data.key,
		});
		if (exists) {
			throw new AppError("project already exists", 409);
		}

		const created = await ProjectModel.create(parsed.data);
		return successResponse(created, 201);
	} catch (error) {
		return errorResponse(error);
	}
}
