import { buildPageMetadata } from "@/lib/seo";

import ProjectPageClient from "@/components/projects/project-page-client";
import { SiteData } from "@/types/portfolio";
import { fetchJson } from "@/lib/data";

type ProjectPageProps = {
	params: Promise<{
		id: string;
	}>;
};

// export async function generateMetadata({
// 	params,
// }: ProjectPageProps) {
// 	const resolvedParams = await params;
// 	const site = await fetchJson<SiteData>("/site.json");
// 	const project = projectResponse.project;

// 	if (!project) {
// 		return buildPageMetadata(site, {
// 			title: "Project not found | Neeta Bhusal",
// 			description: "This project could not be found.",
// 			path: "/projects",
// 		});
// 	}

// 	return buildPageMetadata(site, {
// 		title: `${project.title} | Projects | Neeta Bhusal`,
// 		description: project.summary ?? project.description,
// 		path: `/projects/${encodeURIComponent(project.key)}`,
// 		image:
// 			project.imageUrl ??
// 			`/api/images?publicId=${encodeURIComponent(project.key)}&w=1200&h=900&crop=fill&format=auto&q=auto`,
// 	});
// }

export default async function ProjectPage({
	params,
}: ProjectPageProps) {
	const { id } = await params;
	return <ProjectPageClient id={id} />;
}
