import { Reveal } from "@/components/animations/reveal";
import { PagesProps } from "@/types";

export default async function ProjectsLayout({
	children,
}: PagesProps) {
	return (
		<main className="">
			<div className="space-y-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl space-y-3">
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
					{children}
				</div>
			</div>
		</main>
	);
}
