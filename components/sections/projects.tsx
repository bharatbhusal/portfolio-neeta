"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

import { ErrorState } from "@/components/ui/error-state";
import { ProjectCardBox } from "@/components/cards/project-card-box";
import { Reveal } from "@/app/animations/reveal";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	InputGroup,
	InputGroupInput,
	InputGroupAddon,
} from "@/components/ui/input-group";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useGSAP } from "@/hooks/useGSAP";
import type { Project } from "@/types/portfolio";

type PaginationData = {
	page: number;
	pageSize: number;
	total: number;
	totalPages: number;
};

type SortBy = "createdAt" | "title";
type SortOrder = "asc" | "desc";

type ProjectGridContentProps = {
	projects: Project[];
	categories: string[];
	pagination: PaginationData;
	basePath: string;
	currentCategory: string;
	currentQuery: string;
	currentSortBy: SortBy;
	currentSortOrder: SortOrder;
	currentFeatured: boolean;
	currentClient: boolean;
};

const SORT_LABELS: Record<SortBy, string> = {
	createdAt: "Latest",
	title: "Title",
};

const DEFAULT_SORT: SortBy = "createdAt";
const DEFAULT_ORDER: SortOrder = "desc";

function sortDefaultOrder(field: SortBy): SortOrder {
	return field === "title" ? "asc" : "desc";
}

function buildUrl(
	basePath: string,
	page: number,
	category: string,
	q: string,
	featured: boolean,
	client: boolean,
	sortBy: SortBy,
	sortOrder: SortOrder,
) {
	const params = new URLSearchParams();
	params.set("page", String(page));
	if (category && category !== "All") {
		params.set("category", category);
	}
	if (q) {
		params.set("q", q);
	}
	if (featured) {
		params.set("featured", "true");
	}
	if (client) {
		params.set("client", "true");
	}
	if (
		sortBy !== DEFAULT_SORT ||
		sortOrder !== DEFAULT_ORDER
	) {
		params.set("sortBy", sortBy);
		params.set("sortOrder", sortOrder);
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
	currentSortBy,
	currentSortOrder,
	currentFeatured,
	currentClient,
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
					buildUrl(
						basePath,
						1,
						currentCategory,
						trimmed,
						currentFeatured,
						currentClient,
						currentSortBy,
						currentSortOrder,
					),
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
		currentFeatured,
		currentClient,
		currentSortBy,
		currentSortOrder,
	]);

	const handleFilterChange = useCallback(
		(filter: "featured" | "client") => {
			const newFeatured =
				filter === "featured" ? !currentFeatured : false;
			const newClient =
				filter === "client" ? !currentClient : false;
			router.push(
				buildUrl(
					basePath,
					1,
					currentCategory,
					currentQuery,
					newFeatured,
					newClient,
					currentSortBy,
					currentSortOrder,
				),
			);
		},
		[
			basePath,
			currentCategory,
			currentQuery,
			currentFeatured,
			currentClient,
			currentSortBy,
			currentSortOrder,
			router,
		],
	);

	const handleSortChange = useCallback(
		(field: SortBy) => {
			const newSortBy: SortBy = field;
			let newSortOrder: SortOrder;

			if (field !== currentSortBy) {
				newSortOrder = sortDefaultOrder(field);
			} else {
				newSortOrder =
					currentSortOrder === "asc" ? "desc" : "asc";
			}

			router.push(
				buildUrl(
					basePath,
					1,
					currentCategory,
					currentQuery,
					currentFeatured,
					currentClient,
					newSortBy,
					newSortOrder,
				),
			);
		},
		[
			basePath,
			currentCategory,
			currentQuery,
			currentFeatured,
			currentClient,
			currentSortBy,
			currentSortOrder,
			router,
		],
	);

	const handleCategoryChange = useCallback(
		(category: string) => {
			router.push(
				buildUrl(
					basePath,
					1,
					category,
					currentQuery,
					currentFeatured,
					currentClient,
					currentSortBy,
					currentSortOrder,
				),
			);
		},
		[
			basePath,
			currentQuery,
			currentFeatured,
			currentClient,
			currentSortBy,
			currentSortOrder,
			router,
		],
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			router.push(
				buildUrl(
					basePath,
					newPage,
					currentCategory,
					currentQuery,
					currentFeatured,
					currentClient,
					currentSortBy,
					currentSortOrder,
				),
			);
		},
		[
			basePath,
			currentCategory,
			currentQuery,
			currentFeatured,
			currentClient,
			currentSortBy,
			currentSortOrder,
			router,
		],
	);

	const isSortActive = (field: SortBy) =>
		currentSortBy === field;

	const sortArrow = (field: SortBy) => {
		if (!isSortActive(field)) return "";
		return currentSortOrder === "desc" ? " ↓" : " ↑";
	};

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl"
		>
			<div className="space-y-4">
				<Reveal>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap items-center gap-2">
							<ButtonGroup>
								<Button
									variant={currentFeatured ? "default" : "outline"}
									size="sm"
									onClick={() => handleFilterChange("featured")}
								>
									Featured
								</Button>
								<Button
									variant={currentClient ? "default" : "outline"}
									size="sm"
									onClick={() => handleFilterChange("client")}
								>
									Clients
								</Button>
							</ButtonGroup>

							<ButtonGroup>
								{(["createdAt", "title"] as SortBy[]).map(
									(field) => (
										<Button
											key={field}
											variant={
												isSortActive(field) ? "default" : "outline"
											}
											size="sm"
											onClick={() => handleSortChange(field)}
										>
											{SORT_LABELS[field]}
											{sortArrow(field)}
										</Button>
									),
								)}
							</ButtonGroup>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm">
										{currentCategory}
										<ChevronDownIcon className="ml-1 size-3.5" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="start" className="w-40">
									<DropdownMenuRadioGroup
										value={currentCategory}
										onValueChange={handleCategoryChange}
									>
										{categories.map((cat) => (
											<DropdownMenuRadioItem key={cat} value={cat}>
												{cat}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div className="w-full sm:w-80">
							<label className="sr-only" htmlFor="project-search">
								Search projects
							</label>
							<InputGroup>
								<InputGroupAddon>
									<Search />
								</InputGroupAddon>
								<InputGroupInput
									id="project-search"
									type="search"
									value={searchValue}
									onChange={(event) =>
										setSearchValue(event.target.value)
									}
									placeholder="Search projects"
									aria-label="Search projects"
								/>
								<InputGroupAddon align="inline-end">
									{pagination.total} results
								</InputGroupAddon>
							</InputGroup>
						</div>
					</div>
				</Reveal>

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
