import { ErrorState } from "@/components/ui/error-state";
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
			<ErrorState
				variant="error"
				title="Unable to load project"
				message="The project you're trying to edit could not be found."
				action={{
					label: "Back to admin",
					href: "/admin/projects",
				}}
			/>
		);
	}

	return <ProjectForm mode="edit" project={project} />;
}
