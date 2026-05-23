import { NextResponse } from "next/server";

import { readJson } from "@/lib/serverData";
import type {
	Project,
	ProjectsData,
} from "@/types/portfolio";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const key = searchParams.get("key");

	if (!key) {
		return NextResponse.json({ project: null });
	}

	const projectsData =
		await readJson<ProjectsData>("projects.json");
	const decodedKey = decodeURIComponent(key);
	const project = (projectsData.projects as Project[]).find(
		(item) => item.key === decodedKey,
	);

	return NextResponse.json({ project: project ?? null });
}
