"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { ProjectCard } from "@/components/cards/project-card";
import { ProjectCardSkeleton } from "@/components/cards/project-card-skeleton";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import type { PaginatedProjectsData } from "@/types/portfolio";

type ProjectGridQuery = {
	page: number;
	category: string;
	q: string;
};

export type ProjectGridProps = {
	data: PaginatedProjectsData;
	categories: string[];
	basePath: string;
	title: string;
	description: string;
	initialQuery?: string;
	initialPage?: number;
	initialCategory?: string;
};

export function ProjectGrid({
	data,
	categories,
	basePath,
	title,
	description,
	initialQuery,
	initialPage = 1,
	initialCategory = "All",
}: ProjectGridProps) {
	const router = useRouter();
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });
	const [currentCategory, setCurrentCategory] =
		useState(initialCategory);
	const [searchValue, setSearchValue] = useState(
		initialQuery ?? "",
	);
	const [debouncedQuery, setDebouncedQuery] = useState(
		initialQuery?.trim() ?? "",
	);
	const [isPending, startTransition] = useTransition();
	const didDebounceRef = useRef(false);

	useEffect(() => {
		const handle = setTimeout(() => {
			setDebouncedQuery(searchValue.trim());
		}, 300);
		return () => clearTimeout(handle);
	}, [searchValue]);

	const updateUrl = useCallback(
		(params: ProjectGridQuery) => {
			const paramsValue = new URLSearchParams();
			paramsValue.set("page", String(params.page));
			if (params.category && params.category !== "All") {
				paramsValue.set("category", params.category);
			}
			if (params.q) {
				paramsValue.set("q", params.q);
			}
			const url = `${basePath}?${paramsValue.toString()}`;
			startTransition(() => {
				router.replace(url, { scroll: false });
			});
		},
		[basePath, router],
	);

	useEffect(() => {
		if (!didDebounceRef.current) {
			didDebounceRef.current = true;
			return;
		}
		updateUrl({
			page: 1,
			category: currentCategory,
			q: debouncedQuery,
		});
	}, [currentCategory, debouncedQuery, updateUrl]);

	const handleCategoryChange = useCallback(
		(category: string, query: string) => {
			setCurrentCategory(category);
			updateUrl({
				page: 1,
				category,
				q: query,
			});
		},
		[updateUrl],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			updateUrl({
				page: newPage,
				category: currentCategory,
				q: debouncedQuery,
			});
		},
		[currentCategory, debouncedQuery, updateUrl],
	);

	const projects = data.projects;
	const pagination = data.pagination;

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
									onClick={() =>
										handleCategoryChange(category, debouncedQuery)
									}
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
						{isPending ? (
							<>
								{Array.from({ length: 9 }).map((_, i) => (
									<ProjectCardSkeleton key={i} />
								))}
							</>
						) : projects.length === 0 ? (
							<p className="text-sm text-muted-foreground">
								No projects match your search.
							</p>
						) : (
							<>
								{projects.map((project) => (
									<ProjectCard key={project.key} project={project} />
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
