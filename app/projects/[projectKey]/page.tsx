import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ProjectsData,
	SiteData,
} from "@/types/portfolio";
import { ProjectPageContent } from "@/components/projects/project-page-content";

type ProjectPageProps = {
	params: Promise<{
		projectKey: string;
	}>;
};

export async function generateMetadata({
	params,
}: ProjectPageProps) {
	const [site, projects, resolvedParams] = await Promise.all(
		[
			fetchJson<SiteData>("/data/site.json"),
			fetchJson<ProjectsData>("/data/projects.json"),
			params,
		],
	);
	const project = projects.projects.find(
		(item) =>
			item.key ===
			decodeURIComponent(resolvedParams.projectKey),
	);

	if (!project) {
		return buildPageMetadata(site, {
			title: "Project not found | Neeta Bhusal",
			description: "This project could not be found.",
			path: "/projects",
		});
	}

	return buildPageMetadata(site, {
		title: `${project.title} | Projects | Neeta Bhusal`,
		description: project.summary ?? project.description,
		path: `/projects/${encodeURIComponent(project.key)}`,
		image: project.key,
	});
}

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const [projects, resolvedParams] = await Promise.all([
		fetchJson<ProjectsData>("/data/projects.json"),
		params,
	]);
	const project = projects.projects.find(
		(item) =>
			item.key ===
			decodeURIComponent(resolvedParams.projectKey),
	);

	if (!project) {
		notFound();
	}

	return <ProjectPageContent project={project} />;
}
