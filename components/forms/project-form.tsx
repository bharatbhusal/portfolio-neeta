"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	useMemo,
	useState,
	useEffect,
	useRef,
} from "react";
import { FiPlus, FiEdit2 } from "react-icons/fi";

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

function renameFileForUpload(file: File) {
	return new File([file], `${crypto.randomUUID()}`);
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
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [previewUrl, setPreviewUrl] = useState<
		string | null
	>(project?.imageUrl ?? null);
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

		return selectedFile.name;
	}, [project?.key, selectedFile]);

	const signatureQuery = useGetSignature(
		selectedFile ? selectedKey : "",
	);

	useEffect(() => {
		let objectUrl: string | null = null;
		if (selectedFile) {
			objectUrl = URL.createObjectURL(selectedFile);
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setPreviewUrl(objectUrl);
		} else {
			setPreviewUrl(project?.imageUrl ?? null);
		}

		return () => {
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [selectedFile, project?.imageUrl]);

	async function handleSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		console.log("Triggered Sumit");
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
	return (
		<div className="grid gap-6">
			<form
				className="space-y-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm"
				onSubmit={handleSubmit}
			>
				<div className="space-y-2">
					<Label htmlFor="project-image">Project image</Label>
					<div className="flex justify-center">
						<div className="relative">
							<div className="w-[250px] h-[250px] overflow-hidden rounded-md bg-muted m-2">
								{previewUrl ? (
									<Image
										src={previewUrl}
										alt={title || "Project preview"}
										width={250}
										height={250}
										className="h-full w-full object-cover"
										unoptimized
									/>
								) : (
									<div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
										{selectedFile
											? `Selected file: ${selectedFile.name}`
											: "Choose an image to preview the cover."}
									</div>
								)}
							</div>

							<Button
								type="button"
								size="icon"
								variant="outline"
								className="absolute top-2 right-2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full p-0"
								onClick={() => fileInputRef.current?.click()}
								aria-label={
									mode === "edit" ? "Edit image" : "Add image"
								}
							>
								{mode === "edit" ? (
									<FiEdit2 className="h-4 w-4" />
								) : (
									<FiPlus className="h-4 w-4" />
								)}
							</Button>

							<Input
								id="project-image"
								ref={fileInputRef}
								type="file"
								accept="image/*"
								className="hidden"
								onChange={(event) => {
									const file = event.target.files?.[0] ?? null;
									setSelectedFile(
										file ? renameFileForUpload(file) : null,
									);
									setLocalError(null);
								}}
							/>
						</div>
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
							onChange={(event) => setCategory(event.target.value)}
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
		</div>
	);
}

export default ProjectForm;
