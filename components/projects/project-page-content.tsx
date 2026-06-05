"use client";

import Image from "next/image";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import type { Project } from "@/types/portfolio";

type ProjectPageContentProps = {
	project: Project;
	isAuthenticated?: boolean;
	whatsappPhone?: string;
};

export function ProjectPageContent({
	project,
	isAuthenticated,
	whatsappPhone,
}: ProjectPageContentProps) {
	const handleWhatsAppEnquiry = () => {
		const artworkUrl = window.location.href;
		const sanitizedPhone = (whatsappPhone ?? "").replace(
			/\D/g,
			"",
		);
		const whatsappMessage = encodeURIComponent(
			`Hi Neeta,\nI am interested in buying the artwork "${project.title}".\nArtwork URL: ${artworkUrl}.\n\nCould you please share availability and pricing?`,
		);
		window.open(
			`https://wa.me/${sanitizedPhone}?text=${whatsappMessage}`,
			"_blank",
			"noopener,noreferrer",
		);
	};

	return (
		<section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Project
				</p>

				<div className="flex flex-wrap items-center gap-3">
					<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
						{project.title}
					</h1>
					{isAuthenticated && (
						<Button asChild variant="outline" size="icon-sm">
							<Link
								href={`/admin/projects/${project._id}`}
								aria-label="Edit project"
							>
								<FiEdit2 className="size-3.5" />
							</Link>
						</Button>
					)}
				</div>
				<div className="width-full flex flex-wrap justify-between text-sm text-muted-foreground text-center">
					<p>
						{project.category} · {project.year}
					</p>
					{project.client && <p>Crafted for {project.client}</p>}
				</div>
			</div>

			<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
				<Image
					src={project.imageUrl ?? ""}
					alt={project.title}
					fill
					priority
					className="object-cover"
				/>
			</div>

			<div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-6">
				{project.story && (
					<p className="text-base leading-7">{project.story}</p>
				)}
				<p className="text-base leading-7 text-muted-foreground">
					{project.description}
				</p>
				<div className="flex flex-wrap gap-3">
					<Button
						onClick={() =>
							window.open(
								project.downloadUrl,
							)
						}
					>
						Download
					</Button>

					{project.link && (
						<Button
							variant={"outline"}
							onClick={() => window.open(project.link)}
						>
							View Online
						</Button>
					)}
					<Button
						variant="outline"
						onClick={handleWhatsAppEnquiry}
					>
						Own it
					</Button>
				</div>
			</div>
		</section>
	);
}
