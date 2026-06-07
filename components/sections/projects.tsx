"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/ui/error-state";
import { ProjectCardBox } from "@/components/cards/project-card-box";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import type { Project } from "@/types/portfolio";

type PaginationData = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
};

type ProjectGridContentProps = {
	projects: Project[];
	categories: string[];
	pagination: PaginationData;
	basePath: string;
	currentCategory: string;
	currentQuery: string;
};

function buildUrl(
	basePath: string,
	page: number,
	category: string,
	q: string,
) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	if (category && category !== "All") {
		params.set("category", category);
	}
	if (q) {
		params.set("q", q);
	}
	return `${basePath}?${params.toString()}`;
}

export function ProjectGridContent({
	projects,
	categories,
	pagination,
	basePath,
	currentCategory,
	currentQuery,
}: ProjectGridContentProps) {
	const router = useRouter();
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

	const [searchValue, setSearchValue] =
		useState(currentQuery);

	useEffect(() => {
		const handle = setTimeout(() => {
			const trimmed = searchValue.trim();
			if (trimmed !== currentQuery) {
				router.push(
					buildUrl(basePath, 1, currentCategory, trimmed),
				);
			}
		}, 300);
		return () => clearTimeout(handle);
	}, [
		searchValue,
		currentCategory,
		currentQuery,
		basePath,
		router,
	]);

	const handleCategoryChange = useCallback(
		(category: string) => {
			router.push(
				buildUrl(basePath, 1, category, searchValue.trim()),
			);
		},
		[basePath, searchValue, router],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			router.push(
				buildUrl(
					basePath,
					newPage,
					currentCategory,
					currentQuery,
				),
			);
		},
		[basePath, currentCategory, currentQuery, router],
	);

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl"
		>
			<div className="space-y-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<Reveal>
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
									onClick={() => handleCategoryChange(category)}
								>
									{category}
								</Button>
							))}
						</div>
					</Reveal>

					<Reveal>
						<div className="w-full sm:w-72">
							<label className="sr-only" htmlFor="project-search">
								Search projects
							</label>
							<input
								id="project-search"
								type="search"
								value={searchValue}
								onChange={(event) =>
									setSearchValue(event.target.value)
								}
								placeholder="Search projects"
								className="w-full rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
								aria-label="Search projects"
							/>
						</div>
					</Reveal>
				</div>

				<Reveal>
					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{projects.length === 0 ? (
							<div className="col-span-full">
								<ErrorState
									variant="empty"
									title="No projects found"
									message="No projects match your current search or filter criteria."
								/>
							</div>
						) : (
							<>
								{projects.map((project) => (
									<ProjectCardBox
										key={project.key}
										project={project}
									/>
								))}
							</>
						)}
					</div>
				</Reveal>

				{pagination.totalPages > 1 && (
					<div className="flex items-center justify-between gap-3">
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								handlePageChange(
									pagination.page <= 1
										? pagination.totalPages
										: pagination.page - 1,
								)
							}
						>
							Previous
						</Button>
						<p className="text-sm text-muted-foreground">
							Page {pagination.page} of {pagination.totalPages}
						</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() =>
								handlePageChange(
									pagination.page >= pagination.totalPages
										? 1
										: pagination.page + 1,
								)
							}
						>
							Next
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
