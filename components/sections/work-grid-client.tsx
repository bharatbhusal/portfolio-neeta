"use client";

import { useCallback, useRef, useState } from "react";

import {
	WorkGrid,
	type WorkGridProps,
} from "@/components/sections/work-grid";
import type { PaginatedProjectsData } from "@/types/portfolio";

type WorkGridClientProps = Omit<WorkGridProps, "onChange">;

type WorkGridRequest = {
	page: number;
	category: string;
	q: string;
};

export function WorkGridClient({
	projects: initialProjects,
	categories: initialCategories,
	currentCategory: initialCategory,
	pagination: initialPagination,
	...rest
}: WorkGridClientProps) {
	const [projects, setProjects] = useState(initialProjects);
	const [categories, setCategories] = useState(
		initialCategories,
	);
	const [currentCategory, setCurrentCategory] =
		useState(initialCategory);
	const [pagination, setPagination] = useState(
		initialPagination,
	);
	const requestIdRef = useRef(0);

	const handleChange = useCallback(
		async ({ page, category, q }: WorkGridRequest) => {
			const params = new URLSearchParams();
			params.set("page", String(page));
			params.set("pageSize", String(pagination.pageSize));
			if (category && category !== "All") {
				params.set("category", category);
			}
			if (q) {
				params.set("q", q);
			}

			const requestId = requestIdRef.current + 1;
			requestIdRef.current = requestId;

			const response = await fetch(
				`/api/projects?${params.toString()}`,
			);
			if (!response.ok) {
				return;
			}

			const data =
				(await response.json()) as PaginatedProjectsData;
			if (requestIdRef.current !== requestId) {
				return;
			}

			setProjects(data.projects);
			setCategories(data.categories);
			setPagination(data.pagination);
			setCurrentCategory(category || "All");
		},
		[pagination.pageSize],
	);

	return (
		<WorkGrid
			{...rest}
			projects={projects}
			categories={categories}
			currentCategory={currentCategory}
			pagination={pagination}
			onChange={handleChange}
		/>
	);
}
