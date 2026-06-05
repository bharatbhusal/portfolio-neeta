import { PagesProps } from "@/types";

export default async function UpdateProjectLayout({
	children,
}: PagesProps) {
	return (
		<main className="mx-auto w-full max-w-7xl">
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
			{children}
		</main>
	);
}
