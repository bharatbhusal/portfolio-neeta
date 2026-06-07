import { buildPageMetadata } from "@/lib/seo";

import { ProjectPageContent } from "@/components/projects/project-page-content";
import { SiteData } from "@/types/portfolio";
import { fetchJson } from "@/lib/data";
import { getProjectByIdController } from "@/controllers/projects";

type ProjectPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export async function generateMetadata({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	const site = await fetchJson<SiteData>("/site.json");
	const project = await getProjectByIdController(id);

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

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	const site = await fetchJson<SiteData>("/site.json");
	const project = await getProjectByIdController(id);

	if (!project) {
		return (
			<div className="text-center py-12 text-muted-foreground">
				Project not found.
			</div>
		);
	}

	return (
		<ProjectPageContent
			project={project}
			whatsappPhone={site.phone}
		/>
	);
}
