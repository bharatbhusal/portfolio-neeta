"use client";

import React from "react";
import { useProject } from "@/hooks/useApi";
import { ProjectPageContent } from "@/components/projects/project-page-content";
import { ProjectPageSkeleton } from "@/components/projects/project-page-skeleton";

type Props = {
	id: string;
	whatsappPhone?: string;
};

export default function ProjectPageClient({
	id,
	whatsappPhone,
}: Props) {
	const { data, isLoading, error } = useProject(id);

	if (isLoading) return <ProjectPageSkeleton />;
	if (error) return <div>Unable to load project.</div>;

	if (!data) return <div>Project not found.</div>;

	return (
		<ProjectPageContent
			project={data}
			whatsappPhone={whatsappPhone}
		/>
	);
}
