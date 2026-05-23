import { ProjectForm } from "@/components/forms/project-form";

export default function NewProjectPage() {
	return (
		<main className="mx-auto max-w-4xl p-6">
			<h1 className="mb-4 text-2xl font-semibold">
				Create Project
			</h1>
			<ProjectForm />
		</main>
	);
}
