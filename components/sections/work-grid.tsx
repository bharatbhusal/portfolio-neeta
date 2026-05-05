"use client";

import { useMemo, useRef, useState } from "react";

import { ProjectCard } from "@/components/cards/project-card";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import type { Project } from "@/types/portfolio";

type WorkGridProps = {
	projects: Project[];
	title: string;
	description: string;
	showFilters?: boolean;
};

export function WorkGrid({
	projects,
	title,
	description,
	showFilters = false,
}: WorkGridProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	const [activeCategory, setActiveCategory] =
		useState("All");
	useGSAP({ scope: scopeRef });

	const categories = useMemo(() => {
		const list = projects.flatMap((project) => {
			const cat = project.category ?? "Uncategorized";
			return Array.isArray(cat) ? cat : [cat];
		});
		return ["All", ...Array.from(new Set(list))];
	}, [projects]);

	const visibleProjects =
		activeCategory === "All"
			? projects
			: projects.filter((project) => {
					const cats = Array.isArray(project.category)
						? project.category
						: [project.category ?? "Uncategorized"];

					const active = activeCategory.toLowerCase();

					const matchesCategory = cats
						.map((c) => String(c).toLowerCase())
						.includes(active);

					const matchesTag = (project.tags || [])
						.map((t) => String(t).toLowerCase())
						.includes(active);

					return matchesCategory || matchesTag;
				});

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
		>
			<div className="space-y-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="max-w-2xl space-y-3">
						<Reveal>
							<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
								Work
							</p>
						</Reveal>
						<Reveal>
							<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
								{title}
							</h2>
						</Reveal>
						<Reveal>
							<p className="text-base leading-7 text-muted-foreground">
								{description}
							</p>
						</Reveal>
					</div>

					{showFilters ? (
						<div className="flex flex-wrap gap-2">
							{categories.map((category) => (
								<Button
									key={category}
									type="button"
									variant={
										activeCategory === category
											? "default"
											: "outline"
									}
									size="sm"
									onClick={() => setActiveCategory(category)}
								>
									{category}
								</Button>
							))}
						</div>
					) : null}
				</div>

				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{visibleProjects.map((project) => (
						<ProjectCard key={project.key} project={project} />
					))}
				</div>
			</div>
		</section>
	);
}
