import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/db";
import { ProjectModel } from "@/models/project";
import { ProjectInputSchema } from "@/lib/validators";
import { hydrateProject } from "@/lib/projectAssets";
import type { Project } from "@/types/portfolio";
import {
	errorResponse,
	successResponse,
} from "@/lib/apiResponse";
import { getAuthPayload } from "@/lib/auth";
import { AppError } from "@/lib/errors";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const key = searchParams.get("key");

		if (!key) {
			throw new AppError("project key is required", 401);
		}

		await connectToDatabase();
		const project = await ProjectModel.findOne({
			key: decodeURIComponent(key),
		}).lean<Project | null>();

		return successResponse({
			project: project ? hydrateProject(project) : null,
		});
	} catch (error) {
		return errorResponse(error);
	}
}

export async function PUT(request: Request) {
	try {
		await getAuthPayload();
		const { searchParams } = new URL(request.url);
		const key = searchParams.get("key");
		if (!key) {
			throw new AppError("project key is required", 401);
		}

		const payload = await request.json().catch(() => null);
		const parsed = ProjectInputSchema.safeParse(payload);
		if (!parsed.success) {
			throw new AppError("Invalid project payload", 400);
		}

		await connectToDatabase();
		const updated = await ProjectModel.findOneAndUpdate(
			{ key: decodeURIComponent(key) },
			parsed.data,
			{ new: true },
		).lean<Project | null>();

		if (!updated) {
			throw new AppError("project not found", 404);
		}
		return successResponse(updated);
	} catch (error) {
		return errorResponse(error);
	}
}

export async function DELETE(request: Request) {
	try {
		await getAuthPayload();

		const { searchParams } = new URL(request.url);
		const key = searchParams.get("key");
		if (!key) {
			throw new AppError("project key is required", 401);
		}

		await connectToDatabase();
		const deleted = await ProjectModel.findOneAndDelete({
			key: decodeURIComponent(key),
		});

		if (!deleted) {
			throw new AppError("project not found", 404);
		}

		return successResponse({
			deleted: true,
			key: deleted.key,
		});
	} catch (error) {
		return errorResponse(error);
	}
}
