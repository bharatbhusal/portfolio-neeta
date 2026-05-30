import { notFound } from "next/navigation";

import { ProjectForm } from "@/components/forms/project-form";

export default async function EditProjectPage(props: any) {
	const { projectKey } = props.params as {
		projectKey: string;
	};
	// const res = await getProjectByKey(projectKey);
	// const project = res.project;
	// if (!project) {
	// 	notFound();
	// }

	return (
		<main className="mx-auto max-w-4xl p-6">
			<h1 className="mb-4 text-2xl font-semibold">
				Edit Project
			</h1>
			{/* <ProjectForm initialProject={project} /> */}
		</main>
	);
}
