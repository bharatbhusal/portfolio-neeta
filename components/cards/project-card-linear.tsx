import Image from "next/image";
import Link from "next/link";

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

export function ProjectCardLinear({
	project,
}: ProjectCardProps) {
	return (
		<Link
			href={`/projects/${encodeURIComponent(project._id)}`}
			className="block"
		>
			<Card className="group overflow-hidden border-border/60 bg-card/70 backdrop-blur cursor-pointer transition-colors hover:bg-card flex flex-row">
				<div className="px-4">
					<div className="flex items-start justify-between gap-3">
						<div className="min-w-0">
							<p className="text-lg font-bold text-wrap">
								{project.title}
							</p>

							{project.client && (
								<p className="text-xs text-primary font-medium uppercase tracking-[0.16em] text-wrap">
									{project.client}
								</p>
							)}
						</div>
					</div>

					<p className="text-sm leading-6 line-clamp-3">
						{project.description}
					</p>
					<div className="flex flex-wrap gap-2 hidden md:flex py-4">
						{project.tags.map((tag) => (
							<span
								key={tag}
								className="rounded-full border border-border/60 bg-secondary/80 px-3 py-1 text-xs text-secondary-foreground"
							>
								{tag}
							</span>
						))}
					</div>
				</div>

				<div className="relative hidden md:block w-60 flex-shrink-0 border-r border-border/60 pr-2">
					<div className="relative h-full min-h-[180px]">
						<div className="absolute right-3 top-3 z-10 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-foreground backdrop-blur">
							{project.year}
						</div>

						<Image
							src={
								project.imageUrl ??
								`/api/images?publicId=${encodeURIComponent(
									project.key,
								)}&w=1080&h=720&crop=fill&format=auto&q=auto`
							}
							alt={project.title}
							fill
							priority={project.featured}
							className="object-cover rounded-r-lg"
						/>

						<div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-background/90 pointer-events-none" />
					</div>
				</div>
			</Card>
		</Link>
	);
}
