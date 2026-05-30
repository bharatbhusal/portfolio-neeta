import Image from "next/image";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
	project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
	const cardSummary = project.summary ?? project.description;

	return (
		<Card
			className="group h-full border-border/60 bg-card/70 backdrop-blur cursor-pointer"
			onClick={() =>
				location.assign(
					`/projects/${encodeURIComponent(project._id)}`,
				)
			}
		>
			<div className="relative aspect-[4/3] overflow-hidden border-b border-border/60">
				<Image
					src={
						project.imageUrl ??
						`/api/images?publicId=${encodeURIComponent(project.key)}&w=1200&h=900&crop=fill&format=auto&q=auto`
					}
					alt={project.title}
					fill
					className="object-cover transition duration-700"
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					priority={project.featured}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
				<div className="absolute left-4 top-4 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-foreground backdrop-blur">
					{project.category}
				</div>
			</div>

			<CardHeader>
				<CardTitle className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
					<div className="text-xl font-bold">
						{project.title}
					</div>
					<div>{project.year}</div>
				</CardTitle>
				<CardDescription className="text-sm leading-6">
					{cardSummary}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-2">
					{project.tags.map((tag) => (
						<span
							key={tag}
							className="rounded-full border border-border/60 bg-secondary/80 px-3 py-1 text-xs text-secondary-foreground"
						>
							{tag}
						</span>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
