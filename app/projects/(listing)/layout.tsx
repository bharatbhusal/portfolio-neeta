import { Reveal } from "@/components/animations/reveal";
import { PagesProps } from "@/types";

export default function ProjectsListingLayout({
	children,
}: PagesProps) {
	return (
		<main>
			<div className="space-y-4">
				<Reveal>
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Projects
					</p>
				</Reveal>
				<Reveal>
					<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						Explore the full archive
					</h2>
				</Reveal>
				<Reveal>
					<p className="text-base leading-7 text-muted-foreground">
						Filter by category to review branding, editorial,
						product, and motion work.
					</p>
				</Reveal>
			</div>
			<div className="mt-4">{children}</div>
		</main>
	);
}
