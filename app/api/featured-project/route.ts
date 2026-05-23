import { NextResponse } from "next/server";

import { readJson } from "@/lib/serverData";
import type {
	Project,
	ProjectsData,
} from "@/types/portfolio";

export const dynamic = "force-dynamic";

export async function GET() {
	const projectsData =
		await readJson<ProjectsData>("projects.json");
	const featured = (
		projectsData.projects as Project[]
	).filter((project) => project.featured);
	const project = featured.length
		? featured[Math.floor(Math.random() * featured.length)]
		: null;

	return NextResponse.json(
		{ project },
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}
