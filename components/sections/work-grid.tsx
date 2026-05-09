"use client";

import Link from "next/link";
import { useRef } from "react";

import { ProjectCard } from "@/components/cards/project-card";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import type {
	PaginatedProjectsData,
	Project,
} from "@/types/portfolio";

type WorkGridProps = {
	projects: Project[];
	categories: string[];
	currentCategory: string;
	basePath: string;
	pagination: PaginatedProjectsData["pagination"];
	title: string;
	description: string;
	showFilters?: boolean;
};

export function WorkGrid({
	projects,
	categories,
	currentCategory,
	basePath,
	pagination,
	title,
	description,
	showFilters = false,
}: WorkGridProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });
	const createQuery = (page: number, category?: string) => {
		const params = new URLSearchParams();
		params.set("page", String(page));
		if (category && category !== "All") {
			params.set("category", category);
		}
		return `${basePath}?${params.toString()}`;
	};

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
								Projects
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
									variant={
										currentCategory === category
											? "default"
											: "outline"
									}
									size="sm"
									asChild
								>
									<Link href={createQuery(1, category)}>
										{category}
									</Link>
								</Button>
							))}
						</div>
					) : null}
				</div>

				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{projects.map((project) => (
						<ProjectCard key={project.key} project={project} />
					))}
				</div>
				<div className="flex items-center justify-between gap-3">
					<Button
						asChild
						variant="outline"
						size="sm"
						disabled={pagination.page <= 1}
					>
						<Link
							aria-disabled={pagination.page <= 1}
							href={createQuery(
								Math.max(1, pagination.page - 1),
								currentCategory,
							)}
						>
							Previous
						</Link>
					</Button>
					<p className="text-sm text-muted-foreground">
						Page {pagination.page} of {pagination.totalPages}
					</p>
					<Button
						asChild
						variant="outline"
						size="sm"
						disabled={pagination.page >= pagination.totalPages}
					>
						<Link
							aria-disabled={pagination.page >= pagination.totalPages}
							href={createQuery(
								Math.min(
									pagination.totalPages,
									pagination.page + 1,
								),
								currentCategory,
							)}
						>
							Next
						</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
