"use client";

import React from "react";
import { useProject } from "@/hooks/useApi";
import { ProjectPageContent } from "@/components/projects/project-page-content";
import { ProjectPageSkeleton } from "@/components/projects/project-page-skeleton";
import type { Project } from "@/types/portfolio";

type Props = {
	id: string;
	whatsappPhone?: string;
	initialProject?: Project | null;
};

export default function ProjectPageClient({
	id,
	whatsappPhone,
	initialProject,
}: Props) {
	const hasInitialProjectAttempt =
		typeof initialProject !== "undefined";
	const { data, isLoading, error } = useProject(id, {
		enabled: !hasInitialProjectAttempt,
		initialData: initialProject ?? undefined,
	});
	const project = data ?? initialProject;

	if (isLoading && !project)
		return <ProjectPageSkeleton />;
	if (!project) {
		if (error) return <div>Unable to load project.</div>;
		return <div>Project not found.</div>;
	}

	return (
		<ProjectPageContent
			project={project}
			whatsappPhone={whatsappPhone}
		/>
	);
}
