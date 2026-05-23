import { notFound } from "next/navigation";

import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ProjectResponse,
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
	const resolvedParams = await params;
	const [site, projectResponse] = await Promise.all([
		fetchJson<SiteData>("/api/site"),
		fetchJson<ProjectResponse>(
			`/api/project?key=${encodeURIComponent(resolvedParams.projectKey)}`,
		),
	]);
	const project = projectResponse.project;

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
		image:
			project.imageUrl ??
			`/api/images?publicId=${encodeURIComponent(project.key)}&w=1200&h=900&crop=fill&format=auto&q=auto`,
	});
}

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const resolvedParams = await params;
	const { project } = await fetchJson<ProjectResponse>(
		`/api/project?key=${encodeURIComponent(resolvedParams.projectKey)}`,
	);

	if (!project) {
		notFound();
	}

	return <ProjectPageContent project={project} />;
}
