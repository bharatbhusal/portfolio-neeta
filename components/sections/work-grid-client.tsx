"use client";

import { useCallback, useState, useEffect } from "react";

import {
	WorkGrid,
	type WorkGridProps,
} from "@/components/sections/work-grid";
import { useProjects } from "@/hooks/useApi";

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
	initialQuery,
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

	const [params, setParams] = useState<WorkGridRequest>({
		page: initialPagination.page,
		category: initialCategory,
		q: initialQuery ?? "",
	});

	const projectsQuery = useProjects({
		page: params.page,
		pageSize: pagination.pageSize,
		category: params.category,
		q: params.q,
	});

	const handleChange = useCallback(
		({ page, category, q }: WorkGridRequest) => {
			setParams({ page, category, q });
		},
		[],
	);

	useEffect(() => {
		if (projectsQuery.data) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setProjects(projectsQuery.data.projects);
			setCategories(projectsQuery.data.categories);
			setPagination(projectsQuery.data.pagination);
			setCurrentCategory(params.category || "All");
		}
	}, [projectsQuery.data, params.category]);

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
