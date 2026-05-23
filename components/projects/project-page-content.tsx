"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { Project } from "@/types/portfolio";

type ProjectPageContentProps = {
	project: Project;
};

export function ProjectPageContent({
	project,
}: ProjectPageContentProps) {
	return (
		<section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Project
				</p>

				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					{project.title}
				</h1>
				<div className="width-full flex flex-wrap justify-between text-sm text-muted-foreground text-center">
					<p>
						{project.category} · {project.year}
					</p>
					{project.client && <p>Crafted for {project.client}</p>}
				</div>
			</div>

			<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
				<Image
					src={`/api/images?publicId=${encodeURIComponent(project.key)}&w=1600&h=1200&crop=fill&format=auto&q=auto`}
					alt={project.title}
					fill
					priority
					className="object-cover"
				/>
			</div>

			<div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-6">
				{project.story && (
					<p className="text-base leading-7">{project.story}</p>
				)}
				<p className="text-base leading-7 text-muted-foreground">
					{project.description}
				</p>
				<div className="flex flex-wrap gap-3">
					<Button
						onClick={() =>
							window.open(
								`/api/images?publicId=${encodeURIComponent(project.key)}&download=1&watermark=${encodeURIComponent("Neeta Bhusal")}`,
							)
						}
					>
						Download
					</Button>
					{project.link && (
						<Button
							variant={"outline"}
							onClick={() => window.open(project.link)}
						>
							View Online
						</Button>
					)}
					<Button
						variant="outline"
						onClick={() => location.assign(`/projects`)}
					>
						Back to projects
					</Button>
				</div>
			</div>
		</section>
	);
}
