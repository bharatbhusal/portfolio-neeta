import { PagesProps } from "@/types";

export default async function NewProjectLayout({
	children,
}: PagesProps) {
	return (
		<main className="mx-auto w-full max-w-7xl">
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
			{children}
		</main>
	);
}
