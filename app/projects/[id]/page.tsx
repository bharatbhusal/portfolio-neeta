import { ErrorState } from "@/components/ui/error-state";
import { buildPageMetadata } from "@/lib/seo";

import { ProjectContent } from "../../../components/sections/project";
import { isAuthenticated } from "@/lib/server-auth";
import { fetchJson } from "@/lib/data";
import { getProjectByIdController } from "@/controllers/projects";
import { SiteData } from "@/types/portfolio";

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
	const [site, project, authed] = await Promise.all([
		fetchJson<SiteData>("/site.json"),
		getProjectByIdController(id),
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
