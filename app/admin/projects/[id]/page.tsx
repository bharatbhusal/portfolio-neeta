import ProjectForm from "@/components/forms/project-form";
import { getProjectByIdController } from "@/controllers/projects";

type EditProjectPageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default async function EditProjectPage({
	params,
}: EditProjectPageProps) {
	const { id } = await params;
	const project = await getProjectByIdController(id);

	if (!project) {
		return (
			<div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-sm text-destructive shadow-sm">
				Unable to load project.
			</div>
		);
	}

	return <ProjectForm mode="edit" project={project} />;
}
