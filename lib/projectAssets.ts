import type { Project } from "@/types/portfolio";
import { getEnvConfig } from "./env";

function buildImageUrl(
	publicId: string,
	cloudName: string,
	cloudFolder: string,
) {
	const encoded = publicId
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
	return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,c_fill,w_720,h_1000/${cloudFolder}/${encoded}`;
}

export function hydrateProject(project: Project) {
	const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_FOLDER_NAME } =
		getEnvConfig();

	const imageUrl = buildImageUrl(
		project.key,
		CLOUDINARY_CLOUD_NAME,
		CLOUDINARY_FOLDER_NAME,
	);

	const downloadUrl = `/api/images?publicId=${encodeURIComponent(project.key)}&download=1&watermark=${encodeURIComponent("Neeta Bhusal")}`;

	return {
		...project,
		_id: project._id.toString(),
		imageUrl,
		downloadUrl,
	} as Project;
}

export default hydrateProject;
