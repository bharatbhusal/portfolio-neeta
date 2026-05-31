import ProjectForm from "@/components/forms/project-form";

export default function NewProjectPage() {
	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
			<div className="mb-6 space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Admin
				</p>
				<h1 className="text-3xl font-semibold tracking-tight">
					Create Project
				</h1>
				<p className="text-sm text-muted-foreground">
					Upload the cover image first, then complete the project
					details.
				</p>
			</div>
			<ProjectForm mode="create" />
		</main>
	);
}
