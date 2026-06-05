import ProjectForm from "@/components/forms/project-form";

type EditProjectPageProps = {
	params: Promise<{
		projectKey: string;
	}>;
};

export default async function EditProjectPage({
	params,
}: EditProjectPageProps) {
	const { projectKey } = await params;

	return <ProjectForm mode="edit" projectKey={projectKey} />;
}
