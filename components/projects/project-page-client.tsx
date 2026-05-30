"use client";

import React from "react";
import { useProject } from "@/hooks/useApi";
import { ProjectPageContent } from "@/components/projects/project-page-content";

type Props = {
	id: string;
};

export default function ProjectPageClient({ id }: Props) {
	const { data, isLoading, error } = useProject(id);

	if (isLoading) return <div>Loading…</div>;
	if (error) return <div>Unable to load project.</div>;

	const project = data?.project;
	if (!project) return <div>Project not found.</div>;

	return <ProjectPageContent project={project} />;
}
