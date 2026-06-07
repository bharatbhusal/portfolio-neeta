"use client";

import Image from "next/image";
import Link from "next/link";
import { FiEdit2 } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/portfolio";

type ProjectContentProps = {
	project: Project;
	isAuthenticated?: boolean;
	whatsappPhone?: string;
};

export function ProjectContent({
	project,
	isAuthenticated,
	whatsappPhone,
}: ProjectContentProps) {
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
		<section className="mx-auto w-full max-w-5xl space-y-4">
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
						{project.category} &middot; {project.year}
					</p>
					{project.client && <p>Crafted for {project.client}</p>}
				</div>
			</div>
			<div className="flex flex-col md:flex-row gap-4">
				<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 flex-2 min-w-[50%]">
					<Image
						src={`/api/images?publicId=${encodeURIComponent(project.key)}&w=1600&h=1200&crop=fill&format=auto&q=auto`}
						alt={project.title}
						fill
						priority
						className="object-cover"
					/>
				</div>
				<div className="flex-1 rounded-2xl border border-border/60 bg-card/50 px-6 py-4 h-full">
					<div className="md:max-h-[70vh] md:overflow-y-auto">
						{project.story && (
							<p className="text-base leading-7">
								{project.story}
							</p>
						)}
						<p className="text-base leading-7 text-muted-foreground">
							{project.description}
						</p>
					</div>
					<div className="flex flex-wrap gap-3 pt-4">
						{project.link && (
							<Button onClick={() => window.open(project.link)}>
								View Online
							</Button>
						)}
						<Button
							variant="outline"
							onClick={() =>
								window.open(
									project.downloadUrl ??
										`/api/images?publicId=${encodeURIComponent(project.key)}&download=1&watermark=${encodeURIComponent("Neeta Bhusal")}`,
								)
							}
						>
							Download
						</Button>

						<Button
							variant="outline"
							onClick={handleWhatsAppEnquiry}
						>
							Own it
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
