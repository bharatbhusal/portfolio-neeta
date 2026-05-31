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

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
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
			<ProjectForm mode="edit" projectKey={projectKey} />
		</main>
	);
}
