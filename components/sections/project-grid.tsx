"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

import { ProjectCard } from "@/components/cards/project-card";
import { ProjectCardSkeleton } from "@/components/cards/project-card-skeleton";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import { useProjects, useCategories } from "@/hooks/useApi";

type ProjectGridQuery = {
	page: number;
	category: string;
	q: string;
};

export type ProjectGridProps = {
	basePath: string;
	initialQuery?: string;
	initialPage?: number;
	initialCategory?: string;
};

export function ProjectGrid({
	basePath,
	initialQuery,
	initialPage = 1,
	initialCategory = "All",
}: ProjectGridProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });
	const [page, setPage] = useState(initialPage);
	const [currentCategory, setCurrentCategory] =
		useState(initialCategory);
	const [searchValue, setSearchValue] = useState(
		initialQuery ?? "",
	);
	const [debouncedQuery, setDebouncedQuery] = useState(
		initialQuery?.trim() ?? "",
	);
	const didDebounceRef = useRef(false);

	const { data, isLoading } = useProjects({
		page,
		pageSize: 9,
		category: currentCategory,
		q: debouncedQuery,
	});

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
			if (typeof window !== "undefined") {
				window.history.replaceState(null, "", url);
			}
		},
		[basePath],
	);

	useEffect(() => {
		if (!didDebounceRef.current) {
			didDebounceRef.current = true;
			return;
		}
		setPage(1);
		updateUrl({
			page: 1,
			category: currentCategory,
			q: debouncedQuery,
		});
	}, [currentCategory, debouncedQuery, updateUrl]);

	const handleCategoryChange = useCallback(
		(category: string, query: string) => {
			setCurrentCategory(category);
			setPage(1);
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
			setPage(newPage);
			updateUrl({
				page: newPage,
				category: currentCategory,
				q: debouncedQuery,
			});
		},
		[currentCategory, debouncedQuery, updateUrl],
	);

	const projects = data?.projects ?? [];
	const {
		data: categoriesData,
		isLoading: isCategoriesLoading,
	} = useCategories();
	const categories = categoriesData ?? ["All"];
	const pagination = data?.pagination ?? {
		page: 1,
		pageSize: 9,
		totalCount: 0,
		totalPages: 1,
	};

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl"
		>
			<div className="space-y-8">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<Reveal>
						<div className="flex flex-wrap gap-2">
							{isCategoriesLoading
								? Array.from({ length: 4 }).map((_, i) => (
										<div
											key={i}
											className="h-6 w-20 rounded-md bg-slate-200/60 dark:bg-slate-700/40 animate-pulse"
										/>
									))
								: categories.map((category) => (
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
						{!isCategoriesLoading || !isLoading ? (
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
						) : (
							<div className="w-full sm:w-72 h-8 rounded-md bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
						)}
					</Reveal>
				</div>
				<Reveal>
					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
						{isLoading ? (
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
