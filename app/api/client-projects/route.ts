import { NextResponse } from "next/server";

import { readJson } from "@/lib/serverData";
import type {
	Project,
	ProjectsData,
} from "@/types/portfolio";

const DEFAULT_COUNT = 4;

function toPositiveInt(
	value: string | null,
	fallback: number,
) {
	const parsed = Number(value);
	return Number.isInteger(parsed) && parsed > 0
		? parsed
		: fallback;
}

function shuffle<T>(items: T[]): T[] {
	const array = [...items];
	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const count = toPositiveInt(
		searchParams.get("count"),
		DEFAULT_COUNT,
	);

	const projectsData =
		await readJson<ProjectsData>("projects.json");
	const clientProjects = (
		projectsData.projects as Project[]
	).filter((project) => Boolean(project.client));
	const results = shuffle(clientProjects).slice(0, count);

	return NextResponse.json(
		{ projects: results },
		{
			headers: {
				"Cache-Control": "no-store",
			},
		},
	);
}
