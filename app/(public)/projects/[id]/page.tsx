import { buildPageMetadata } from "@/lib/seo";

import { ProjectPageContent } from "@/components/projects/project-page-content";
import { getSiteData } from "@/lib/data";
import { buildCloudinaryImageUrl } from "@/services/image";
import { getAuthenticatedUserOrNull } from "@/services/auth";
import { getProjectById } from "@/services/projects";
import { notFound } from "next/navigation";

type ProjectPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export async function generateMetadata({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	const site = await getSiteData();
	const project = await getProjectById(id);

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
		image: buildCloudinaryImageUrl(project.key, {
			width: 1200,
			height: 900,
			crop: "fill",
		}),
	});
}

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	const [site, project, user] = await Promise.all([
		getSiteData(),
		getProjectById(id),
		getAuthenticatedUserOrNull(),
	]);

	if (!project) {
		notFound();
	}

	return (
		<ProjectPageContent
			project={project}
			isAuthenticated={Boolean(user)}
			whatsappPhone={site.phone}
		/>
	);
}
