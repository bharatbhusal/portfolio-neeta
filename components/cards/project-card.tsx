import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/types/portfolio";

type ProjectCardProps = {
	project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
	return (
		<Card
			data-hover-lift
			className="group h-full border-border/60 bg-card/70 backdrop-blur"
		>
			<div className="relative aspect-[4/3] overflow-hidden border-b border-border/60">
				<Image
					src={project.image}
					alt={project.title}
					fill
					className="object-cover transition duration-700 group-hover:scale-105"
					sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
					priority={project.featured}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
				<div className="absolute left-4 top-4 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-foreground backdrop-blur">
					{project.category}
				</div>
			</div>

			<CardHeader>
				<div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
					<span>{project.client}</span>
					<span>{project.year}</span>
				</div>
				<CardTitle className="text-xl">
					{project.title}
				</CardTitle>
				<CardDescription className="text-sm leading-6">
					{project.summary}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-4">
				<p className="text-sm leading-6 text-muted-foreground">
					{project.description}
				</p>
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

			<CardFooter className="flex items-center justify-between gap-4 border-t border-border/60 bg-transparent">
				<span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
					Case study
				</span>
				<Button asChild variant="outline" size="sm">
					<Link
						href={project.link}
						target="_blank"
						rel="noreferrer"
					>
						Visit
					</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
