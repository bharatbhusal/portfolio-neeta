"use client";

import { useMemo, useState } from "react";
import {
	useCreateProject,
	useUpdateProject,
} from "@/hooks/useApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { Project } from "@/types/portfolio";

export type ProjectFormValues = {
	key: string;
	title: string;
	category: string;
	summary: string;
	story: string;
	description: string;
	year: string;
	featured: boolean;
	tags: string;
	client: string;
	link: string;
};

const EMPTY_VALUES: ProjectFormValues = {
	key: "",
	title: "",
	category: "",
	summary: "",
	story: "",
	description: "",
	year: "",
	featured: false,
	tags: "",
	client: "",
	link: "",
};

function projectToValues(
	project?: Project,
): ProjectFormValues {
	if (!project) {
		return { ...EMPTY_VALUES };
	}

	return {
		key: project.key ?? "",
		title: project.title ?? "",
		category: project.category ?? "",
		summary: project.summary ?? "",
		story: project.story ?? "",
		description: project.description ?? "",
		year: project.year ?? "",
		featured: Boolean(project.featured),
		tags: project.tags?.join(", ") ?? "",
		client: project.client ?? "",
		link: project.link ? String(project.link) : "",
	};
}

export type ProjectFormProps = {
	initialProject?: Project | null;
	onSubmit?: (payload: Project) => Promise<void>;
	submitLabel?: string;
	disableKey?: boolean;
	isSubmitting?: boolean;
};

export function ProjectForm({
	initialProject,
	onSubmit,
	submitLabel,
	disableKey = false,
	isSubmitting = false,
}: ProjectFormProps) {
	const defaultLabel = initialProject
		? "Save Project"
		: "Create Project";
	const effectiveSubmitLabel = submitLabel ?? defaultLabel;
	const initialValues = useMemo(
		() => projectToValues(initialProject ?? undefined),
		[initialProject],
	);
	const [values, setValues] = useState(initialValues);
	const createMutation = useCreateProject();
	const updateMutation = initialProject
		? useUpdateProject(initialProject.key)
		: null;

	function handleChange(
		field: keyof ProjectFormValues,
		value: string | boolean,
	) {
		setValues((prev) => ({ ...prev, [field]: value }));
	}

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		try {
			const payload: Project = {
				key: values.key.trim(),
				title: values.title.trim(),
				category: values.category.trim(),
				summary: values.summary.trim() || undefined,
				story: values.story.trim() || undefined,
				description: values.description.trim(),
				year: values.year.trim(),
				featured: Boolean(values.featured),
				tags: values.tags
					.split(",")
					.map((tag) => tag.trim())
					.filter(Boolean),
				client: values.client.trim() || undefined,
				link: values.link.trim() || undefined,
			};

			if (onSubmit) {
				await onSubmit(payload);
				return;
			}

			if (initialProject && updateMutation) {
				await updateMutation.mutateAsync(payload);
			} else {
				await createMutation.mutateAsync(payload);
			}
		} catch (err) {
			console.error("Failed to save project", err);
		} finally {
			// Mutation state is managed by React Query; no local isSaving
		}
	}

	return (
		<form className="space-y-6" onSubmit={handleSubmit}>
			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="key">Key</Label>
					<Input
						id="key"
						value={values.key}
						onChange={(event) =>
							handleChange("key", event.target.value)
						}
						disabled={disableKey}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						value={values.title}
						onChange={(event) =>
							handleChange("title", event.target.value)
						}
						required
					/>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="category">Category</Label>
					<Input
						id="category"
						value={values.category}
						onChange={(event) =>
							handleChange("category", event.target.value)
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="year">Year</Label>
					<Input
						id="year"
						value={values.year}
						onChange={(event) =>
							handleChange("year", event.target.value)
						}
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="summary">Summary</Label>
				<Textarea
					id="summary"
					value={values.summary}
					onChange={(event) =>
						handleChange("summary", event.target.value)
					}
					rows={3}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="story">Story</Label>
				<Textarea
					id="story"
					value={values.story}
					onChange={(event) =>
						handleChange("story", event.target.value)
					}
					rows={4}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={values.description}
					onChange={(event) =>
						handleChange("description", event.target.value)
					}
					rows={5}
					required
				/>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="tags">Tags (comma-separated)</Label>
					<Input
						id="tags"
						value={values.tags}
						onChange={(event) =>
							handleChange("tags", event.target.value)
						}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="client">Client</Label>
					<Input
						id="client"
						value={values.client}
						onChange={(event) =>
							handleChange("client", event.target.value)
						}
					/>
				</div>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor="link">Live Link</Label>
					<Input
						id="link"
						type="url"
						value={values.link}
						onChange={(event) =>
							handleChange("link", event.target.value)
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Featured</Label>
					<div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
						<Checkbox
							id="featured"
							checked={values.featured}
							onCheckedChange={(checked) =>
								handleChange("featured", Boolean(checked))
							}
						/>
						<label htmlFor="featured" className="text-sm">
							Highlight on the homepage
						</label>
					</div>
				</div>
			</div>

			<div className="flex flex-wrap gap-3">
				<Button
					type="submit"
					disabled={
						isSubmitting ||
						createMutation.isPending ||
						(updateMutation?.isPending ?? false)
					}
				>
					{isSubmitting ||
					createMutation.isPending ||
					(updateMutation?.isPending ?? false)
						? "Saving..."
						: effectiveSubmitLabel}
				</Button>
			</div>
		</form>
	);
}
