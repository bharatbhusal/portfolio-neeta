"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateProject,
	useGetSignature,
	useProject,
	useUpdateProject,
} from "@/hooks/useApi";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import type { Project } from "@/types/portfolio";
import type { UploadedAsset } from "@/types/upload";

type ProjectFormMode = "create" | "edit";

type ProjectFormProps = {
	mode: ProjectFormMode;
	projectKey?: string;
	project?: Project;
};

type ProjectFormPayload = {
	key: string;
	title: string;
	category?: string;
	story?: string;
	description?: string;
	year?: number;
	featured?: boolean;
	tags?: string[];
	client?: string;
	link?: string;
};

function normalizeFileKey(name: string) {
	const parts = name.split(".");
	const extension =
		(parts.pop() ?? "jpg")
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "") || "jpg";
	const baseName =
		parts
			.join(".")
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "project";

	return `${baseName}.${extension}`;
}

function deriveKeyFromAsset(
	asset: UploadedAsset,
	fallbackName: string,
) {
	const lastSegment =
		asset.publicId.split("/").pop() ?? fallbackName;
	if (/\.[a-z0-9]+$/i.test(lastSegment)) {
		return lastSegment;
	}
	return `${lastSegment}.${asset.format || "jpg"}`;
}

function normalizeOptionalText(value: string) {
	const trimmed = value.trim();
	return trimmed.length ? trimmed : undefined;
}

function normalizeTags(value: string) {
	const tags = value
		.split(",")
		.map((tag) => tag.trim())
		.filter(Boolean);
	return tags.length ? tags : undefined;
}

export function ProjectForm({
	mode,
	projectKey,
	project,
}: ProjectFormProps) {
	const projectQuery = useProject(projectKey ?? "");

	if (mode === "edit") {
		if (projectQuery.isLoading) {
			return (
				<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
					<div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-sm text-muted-foreground shadow-sm">
						Loading project...
					</div>
				</main>
			);
		}

		if (projectQuery.error || !projectQuery.data) {
			return (
				<main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
					<div className="rounded-2xl border border-border/60 bg-card/60 p-6 text-sm text-destructive shadow-sm">
						Unable to load project.
					</div>
				</main>
			);
		}

		return (
			<ProjectFormContent
				mode={mode}
				project={projectQuery.data}
			/>
		);
	}

	return (
		<ProjectFormContent mode={mode} project={project} />
	);
}

function ProjectFormContent({
	mode,
	project,
}: ProjectFormProps) {
	const router = useRouter();
	const [title, setTitle] = useState(project?.title ?? "");
	const [category, setCategory] = useState(
		project?.category ?? "",
	);
	const [story, setStory] = useState(project?.story ?? "");
	const [description, setDescription] = useState(
		project?.description ?? "",
	);
	const [year, setYear] = useState(project?.year ?? "");
	const [featured, setFeatured] = useState(
		Boolean(project?.featured),
	);
	const [tags, setTags] = useState(
		project?.tags?.join(", ") ?? "",
	);
	const [client, setClient] = useState(
		project?.client ?? "",
	);
	const [link, setLink] = useState(project?.link ?? "");
	const [selectedFile, setSelectedFile] =
		useState<File | null>(null);
	const [uploadProgress, setUploadProgress] = useState<
		number | null
	>(null);
	const [localError, setLocalError] = useState<
		string | null
	>(null);

	const createMutation = useCreateProject();
	const updateMutation = useUpdateProject(
		project?._id ?? "",
	);
	const activeMutation =
		mode === "edit" ? updateMutation : createMutation;

	const selectedKey = useMemo(() => {
		if (!selectedFile) {
			return project?.key ?? "";
		}
		return normalizeFileKey(selectedFile.name);
	}, [project?.key, selectedFile]);

	const signatureQuery = useGetSignature(
		selectedFile ? selectedKey : "",
	);

	async function handleSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();
		setLocalError(null);

		if (!title.trim()) {
			setLocalError("Title is required.");
			return;
		}

		if (mode === "create" && !selectedFile) {
			setLocalError(
				"Upload an image before creating the project.",
			);
			return;
		}

		let finalKey = project?.key ?? "";

		try {
			if (selectedFile) {
				const signatureResult = await signatureQuery.refetch();

				if (!signatureResult.data) {
					throw new Error(
						"Unable to create an upload signature.",
					);
				}

				setUploadProgress(0);
				const uploaded = await uploadImageToCloudinary(
					selectedFile,
					signatureResult.data,
					(progress) => setUploadProgress(progress),
				);
				console.log("uploaded: ", uploaded);
				finalKey = deriveKeyFromAsset(
					uploaded,
					selectedFile.name,
				);
			} else if (!finalKey) {
				throw new Error(
					"An image is required for this project.",
				);
			}

			const payload: ProjectFormPayload = {
				key: finalKey,
				title: title.trim(),
				category: normalizeOptionalText(category),
				story: normalizeOptionalText(story),
				description: normalizeOptionalText(description),
				year: year.trim() ? Number(year) : undefined,
				featured,
				tags: normalizeTags(tags),
				client: normalizeOptionalText(client),
				link: normalizeOptionalText(link),
			};

			if (
				payload.year !== undefined &&
				Number.isNaN(payload.year)
			) {
				throw new Error("Year must be a valid number.");
			}

			const savedProject =
				await activeMutation.mutateAsync(payload);

			router.push(`/projects/${savedProject._id}`);
			// router.refresh();
		} catch (error) {
			setLocalError(
				error instanceof Error
					? error.message
					: "Unable to save project.",
			);
		} finally {
			setUploadProgress(null);
		}
	}

	const isSubmitting =
		activeMutation.isPending || uploadProgress !== null;
	const headline =
		mode === "edit" ? "Update project" : "Create project";
	const descriptionText =
		mode === "edit"
			? "Upload a replacement image if you want a new key. Otherwise update the details and save."
			: "Upload the image first. The final project key will be derived from the image filename and extension.";

	return (
		<div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
			<form
				className="space-y-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm"
				onSubmit={handleSubmit}
			>
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Admin
					</p>
					<h2 className="text-2xl font-semibold tracking-tight">
						{headline}
					</h2>
					<p className="text-sm text-muted-foreground">
						{descriptionText}
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="project-image">Project image</Label>
						<Input
							id="project-image"
							type="file"
							accept="image/*"
							onChange={(event) => {
								const file = event.target.files?.[0] ?? null;
								setSelectedFile(file);
								setLocalError(null);
							}}
						/>
						<p className="text-xs text-muted-foreground">
							{mode === "edit"
								? "Leave this empty to keep the current image and key."
								: "This image upload determines the project key."}
						</p>
					</div>

					<div className="space-y-2">
						<Label>Project key</Label>
						<div className="rounded-lg border border-dashed border-border/70 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
							{selectedKey ||
								"The key will be generated after image upload."}
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="category">Category</Label>
							<Input
								id="category"
								value={category}
								onChange={(event) =>
									setCategory(event.target.value)
								}
								placeholder="Branding, editorial, product..."
							/>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="year">Year</Label>
							<Input
								id="year"
								type="number"
								min="1"
								value={year}
								onChange={(event) => setYear(event.target.value)}
								placeholder={String(new Date().getFullYear())}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="client">Client</Label>
							<Input
								id="client"
								value={client}
								onChange={(event) => setClient(event.target.value)}
								placeholder="Optional client name"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="link">Project link</Label>
						<Input
							id="link"
							type="url"
							value={link}
							onChange={(event) => setLink(event.target.value)}
							placeholder="https://..."
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="tags">Tags</Label>
						<Input
							id="tags"
							value={tags}
							onChange={(event) => setTags(event.target.value)}
							placeholder="branding, motion, poster"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="story">Story</Label>
						<Textarea
							id="story"
							value={story}
							onChange={(event) => setStory(event.target.value)}
							placeholder="A short narrative about the project..."
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={description}
							onChange={(event) =>
								setDescription(event.target.value)
							}
							placeholder="Project details for the public page..."
						/>
					</div>

					<div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-3">
						<Checkbox
							id="featured"
							checked={featured}
							onCheckedChange={(checked) =>
								setFeatured(checked === true)
							}
						/>
						<div className="space-y-1">
							<Label
								htmlFor="featured"
								className="cursor-pointer text-[11px]"
							>
								Featured project
							</Label>
							<p className="text-xs text-muted-foreground">
								Feature this project in highlighted sections.
							</p>
						</div>
					</div>
				</div>

				{localError && (
					<p className="text-sm text-destructive">
						{localError}
					</p>
				)}

				{activeMutation.isError && (
					<p className="text-sm text-destructive">
						{activeMutation.error.message}
					</p>
				)}

				{uploadProgress !== null && (
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs text-muted-foreground">
							<span>Uploading image</span>
							<span>{uploadProgress}%</span>
						</div>
						<div className="h-2 overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary transition-all"
								style={{ width: `${uploadProgress}%` }}
							/>
						</div>
					</div>
				)}

				<div className="flex flex-wrap gap-3">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? mode === "edit"
								? "Saving..."
								: "Creating..."
							: mode === "edit"
								? "Save project"
								: "Create project"}
					</Button>
					<Button asChild variant="outline">
						<Link href="/projects">View public projects</Link>
					</Button>
				</div>
			</form>

			<div className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
				<div className="space-y-1">
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Preview
					</p>
					<h3 className="text-lg font-semibold tracking-tight">
						{title || "Untitled project"}
					</h3>
				</div>

				<div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/40">
					<div className="relative aspect-[4/3] w-full">
						{project?.imageUrl ? (
							<Image
								src={project.imageUrl}
								alt={title || "Project preview"}
								fill
								className="object-cover"
							/>
						) : (
							<div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
								{selectedFile
									? `Selected file: ${selectedFile.name}`
									: "Choose an image to preview the cover."}
							</div>
						)}
					</div>
					{selectedFile && (
						<div className="border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
							New image selected:{" "}
							<span className="font-medium text-foreground">
								{selectedFile.name}
							</span>
						</div>
					)}
				</div>

				<div className="space-y-2 rounded-2xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
					<p>
						{mode === "edit"
							? "If you choose a new file, the project key will change to match that filename."
							: "The uploaded image filename becomes the project key."}
					</p>
					<p>
						Current key:{" "}
						<span className="font-medium text-foreground">
							{selectedKey || "pending"}
						</span>
					</p>
				</div>
			</div>
		</div>
	);
}

export default ProjectForm;
