"use client";

import Link from "next/link";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { ProjectCard } from "@/components/cards/project-card";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import type {
	PaginatedProjectsData,
	Project,
} from "@/types/portfolio";

type WorkGridQuery = {
	page: number;
	category: string;
	q: string;
};

export type WorkGridProps = {
	projects: Project[];
	categories: string[];
	currentCategory: string;
	basePath: string;
	pagination: PaginatedProjectsData["pagination"];
	title: string;
	description: string;
	initialQuery?: string;
	onChange?: (params: WorkGridQuery) => void | Promise<void>;
};

export function WorkGrid({
	projects,
	categories,
	currentCategory,
	basePath,
	pagination,
	title,
	description,
	initialQuery,
	onChange,
}: WorkGridProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });
	const [searchValue, setSearchValue] = useState(
		initialQuery ?? "",
	);
	const [debouncedQuery, setDebouncedQuery] = useState(
		initialQuery?.trim() ?? "",
	);
	const didDebounceRef = useRef(false);
	useEffect(() => {
		const handle = setTimeout(() => {
			setDebouncedQuery(searchValue.trim());
		}, 300);
		return () => clearTimeout(handle);
	}, [searchValue]);
	const updateUrl = useCallback(
		(params: WorkGridQuery) => {
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
	const handleChange = useCallback(
		(params: WorkGridQuery) => {
			updateUrl(params);
			if (onChange) {
				void onChange(params);
			}
		},
		[onChange, updateUrl],
	);
	useEffect(() => {
		if (!didDebounceRef.current) {
			didDebounceRef.current = true;
			return;
		}
		handleChange({
			page: 1,
			category: currentCategory,
			q: debouncedQuery,
		});
	}, [debouncedQuery, currentCategory, handleChange]);
	const createQuery = (
		page: number,
		category?: string,
		q?: string,
	) => {
		const params = new URLSearchParams();
		params.set("page", String(page));
		if (category && category !== "All") {
			params.set("category", category);
		}
		if (q) {
			params.set("q", q);
		}
		return `${basePath}?${params.toString()}`;
	};
	const filteredProjects = useMemo(() => {
		if (!debouncedQuery) {
			return projects;
		}
		const query = debouncedQuery.toLowerCase();
		return projects.filter((project) => {
			const haystack = [
				project.title,
				project.category,
				project.summary,
				project.story,
				project.description,
				project.year,
				project.featured ? "featured" : "not featured",
				project.tags.join(" "),
				project.client,
			]
				.filter(Boolean)
				.join(" ")
				.toLowerCase();
			return haystack.includes(query);
		});
	}, [projects, debouncedQuery]);
	const featuredProjects = filteredProjects.filter(
		(project) => project.featured,
	);
	const otherProjects = filteredProjects.filter(
		(project) => !project.featured,
	);

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
									asChild
								>
									<Link
										href={createQuery(1, category, debouncedQuery)}
										onClick={(event) => {
											if (!onChange) {
												return;
											}
											event.preventDefault();
											handleChange({
												page: 1,
												category,
												q: debouncedQuery,
											});
										}}
									>
										{category}
									</Link>
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
						{featuredProjects.map((project) => (
							<ProjectCard key={project.key} project={project} />
						))}
						{otherProjects.map((project) => (
							<ProjectCard key={project.key} project={project} />
						))}
					</div>
					{filteredProjects.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No projects match your search.
						</p>
					) : null}
				</Reveal>
				{pagination.totalPages > 1 && (
					<div className="flex items-center justify-between gap-3">
						<Button asChild variant="outline" size="sm">
							<Link
								href={createQuery(
									pagination.page <= 1
										? pagination.totalPages
										: pagination.page - 1,
									currentCategory,
									debouncedQuery,
								)}
								onClick={(event) => {
									if (!onChange) {
										return;
									}
									event.preventDefault();
									handleChange({
										page:
											pagination.page <= 1
												? pagination.totalPages
												: pagination.page - 1,
										category: currentCategory,
										q: debouncedQuery,
									});
								}}
							>
								Previous
							</Link>
						</Button>
						<p className="text-sm text-muted-foreground">
							Page {pagination.page} of {pagination.totalPages}
						</p>
						<Button asChild variant="outline" size="sm">
							<Link
								href={createQuery(
									pagination.page >= pagination.totalPages
										? 1
										: pagination.page + 1,
									currentCategory,
									debouncedQuery,
								)}
								onClick={(event) => {
									if (!onChange) {
										return;
									}
									event.preventDefault();
									handleChange({
										page:
											pagination.page >= pagination.totalPages
												? 1
												: pagination.page + 1,
										category: currentCategory,
										q: debouncedQuery,
									});
								}}
							>
								Next
							</Link>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
