import type { Project } from "@/types/portfolio";
import {
	buildProjectDownloadUrl,
	buildProjectImageUrl,
} from "@/services/image";

type ProjectLike = Project & {
	_id?: unknown;
	year?: unknown;
	tags?: unknown;
	featured?: unknown;
};

export function hydrateProject(project: ProjectLike) {
	const imageUrl = buildProjectImageUrl(project.key);
	const downloadUrl = buildProjectDownloadUrl(project.key);

	return {
		...project,
		_id:
			typeof project._id === "string"
				? project._id
				: String(project._id ?? ""),
		year: String(project.year ?? ""),
		featured: Boolean(project.featured),
		tags: Array.isArray(project.tags) ? project.tags : [],
		imageUrl,
		downloadUrl,
	} as Project;
}

export default hydrateProject;
