import { cache } from "react";
import { ErrorState } from "@/components/ui/error-state";
import { buildPageMetadata } from "@/lib/seo";

import { ProjectContent } from "../../../components/sections/project";
import { isAuthenticated } from "@/lib/server-auth";
import { getCachedSiteData } from "@/lib/data";
import { getProjectByIdController } from "@/controllers/projects";

const getCachedProjectById = cache(getProjectByIdController);

type ProjectPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export async function generateMetadata({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	const site = await getCachedSiteData();
	const project = await getCachedProjectById(id);

	if (!project) {
		return buildPageMetadata(site, {
			title: "Project not found | Neeta Bhusal",
			description: "This project could not be found.",
			path: "/projects",
		});
	}

	return buildPageMetadata(site, {
		title: `${project.title} | Projects | Neeta Bhusal`,
		description: project.description,
		path: `/projects/${id}`,
		image: `/api/images?publicId=${encodeURIComponent(project.key)}&w=1200&h=900&crop=fill&format=auto&q=auto`,
	});
}

export const revalidate = 3600;

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	const [site, project, authed] = await Promise.all([
		getCachedSiteData(),
		getCachedProjectById(id),
		isAuthenticated(),
	]);

	if (!project) {
		return (
			<ErrorState
				variant="not-found"
				title="Project not found"
				message="This project could not be found."
				action={{ label: "Browse projects", href: "/projects" }}
			/>
		);
	}

	return (
		<ProjectContent
			project={project}
			whatsappPhone={site.phone}
			isAuthenticated={authed}
		/>
	);
}
