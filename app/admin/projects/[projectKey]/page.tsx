import ProjectForm from "@/components/forms/project-form";
import { getProjectByIdController } from "@/controllers/projects";

type EditProjectPageProps = {
	params: Promise<{
		projectKey: string;
	}>;
};

export default async function EditProjectPage({
	params,
}: EditProjectPageProps) {
	const { projectKey } = await params;
	const project = await getProjectByIdController(projectKey);

	return (
		<>
			<div className="mb-6 space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Admin
				</p>
				<h1 className="text-3xl font-semibold tracking-tight">
					Edit Project
				</h1>
				<p className="text-sm text-muted-foreground">
					Update the project details. Upload a new image to
					rename the key.
				</p>
			</div>
			<ProjectForm
				mode="edit"
				projectKey={projectKey}
				project={project ?? undefined}
			/>
		</>
	);
}
