"use server";

import { revalidatePath } from "next/cache";

import { getAuthPayload } from "@/lib/auth";
import { AppError } from "@/lib/errors";
import {
	ProjectInputSchema,
	ProjectUpdateSchema,
	type ProjectInput,
	type ProjectUpdate,
} from "@/lib/validators";
import { createUploadSignature } from "@/services/image";
import {
	createProject,
	updateProjectService,
} from "@/services/projects";
import type { Project } from "@/types/portfolio";
import type { UploadSignaturePayload } from "@/types/upload";

type ActionResult<T> =
	| { data: T; error?: never }
	| { data?: never; error: string };

function getErrorMessage(error: unknown, fallback: string) {
	if (error instanceof AppError) return error.message;
	if (error instanceof Error) return error.message;
	return fallback;
}

function revalidateProjectViews(project?: Project) {
	revalidatePath("/");
	revalidatePath("/about");
	revalidatePath("/contact");
	revalidatePath("/projects");
	if (project?._id) {
		revalidatePath(`/projects/${project._id}`);
	}
}

export async function createUploadSignatureAction(
	publicId: string,
): Promise<ActionResult<UploadSignaturePayload>> {
	try {
		await getAuthPayload();
		if (!publicId) {
			throw new AppError("public Id is required.");
		}
		return { data: createUploadSignature(publicId) };
	} catch (error) {
		return {
			error: getErrorMessage(
				error,
				"Unable to create an upload signature.",
			),
		};
	}
}

export async function createProjectAction(
	payload: ProjectInput,
): Promise<ActionResult<Project>> {
	try {
		await getAuthPayload();
		const parsed = ProjectInputSchema.parse(payload);
		const project = await createProject(parsed);
		revalidateProjectViews(project);
		return { data: project };
	} catch (error) {
		return {
			error: getErrorMessage(error, "Unable to create project."),
		};
	}
}

export async function updateProjectAction(
	id: string,
	payload: ProjectUpdate,
): Promise<ActionResult<Project>> {
	try {
		await getAuthPayload();
		const parsed = ProjectUpdateSchema.parse(payload);
		const project = await updateProjectService(id, parsed);
		revalidateProjectViews(project);
		return { data: project };
	} catch (error) {
		return {
			error: getErrorMessage(error, "Unable to save project."),
		};
	}
}
