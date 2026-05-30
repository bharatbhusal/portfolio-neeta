"use client";

import { useRef } from "react";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/cards/project-card";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import {
	SocialLink,
	type ContactChannel,
} from "@/types/portfolio";
import Image from "next/image";
import Link from "next/link";
import { iconMap } from "@/lib/iconMapper";
import {
	useClientProjects,
	useFeaturedProjects,
} from "@/hooks/useApi";

type ContactProps = {
	social: SocialLink[];
};
export function Contact({ social }: ContactProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

	const {
		data: featuredProject,
		isLoading: isFeaturedProjectLoading,
	} = useFeaturedProjects(1);

	const {
		data: clientProjects,
		isLoading: isClientProjectsLoading,
	} = useClientProjects();

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
		>
			<div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-start">
				<div className="space-y-6">
					<Reveal>
						<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
							Contact
						</p>
					</Reveal>
					<Reveal>
						<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
							Let’s build something measured and memorable.
						</h2>
					</Reveal>
					<Reveal>
						<p className="max-w-xl text-base leading-7 text-muted-foreground">
							Open for select collaborations, freelance
							engagements, and creative direction partnerships.
						</p>
					</Reveal>

					{/* Channels with Icons */}
					<Reveal>
						<div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
							{social.map((channel: ContactChannel) => {
								const IconComponent = iconMap[channel.icon];
								return (
									<Button
										key={channel.label}
										className="flex items-center gap-2 transition hover:bg-foreground/10"
										variant="outline"
										onClick={() =>
											window.open(
												channel.href,
												"_blank",
												"noopener,noreferrer",
											)
										}
									>
										<IconComponent className="w-4 h-4" />

										<span>{channel.label}</span>
									</Button>
								);
							})}
						</div>
					</Reveal>

					{/* Client Projects Section */}
					{!isFeaturedProjectLoading && featuredProject && (
						<Reveal>
							<ProjectCard project={featuredProject[0]} />
						</Reveal>
					)}
				</div>

				{/* Featured Project on Right */}
				{!isClientProjectsLoading &&
					clientProjects &&
					clientProjects.length > 0 && (
						<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur">
							<div className="flex items-end justify-between gap-3">
								<div className="space-y-2">
									<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
										Recent Client Works
									</p>
									<p className="text-sm leading-6 text-muted-foreground">
										A short selection from the current client work.
									</p>
								</div>
								<Button asChild variant="outline" size="sm">
									<Link href="/projects">View all</Link>
								</Button>
							</div>

							<div className="grid gap-4">
								{clientProjects.map((project) => (
									<div
										key={project.key}
										className="group rounded-xl border border-border/60 bg-background/40 p-4 cursor-pointer hover:bg-background/60 transition"
										onClick={() =>
											location.assign(
												`/projects/${encodeURIComponent(project.key)}`,
											)
										}
									>
										<div className="flex">
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between gap-3 mb-2">
													<div className="flex-1 min-w-0">
														<p className="font-semibold text-foreground truncate">
															{project.title}
														</p>
														<p className="text-xs text-primary font-medium uppercase tracking-[0.16em] truncate">
															{project.client}
														</p>
													</div>
												</div>
												<p className="text-sm text-muted-foreground leading-5 line-clamp-3">
													{project.summary || project.description}
												</p>
											</div>
											<div className="relative hidden sm:block w-28 sm:w-36 md:w-44 aspect-[16/9] overflow-hidden rounded-r-md flex-shrink-0">
												<p className="absolute right-2 top-2 z-10 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-foreground backdrop-blur">
													{project.year}
												</p>
												<Image
													src={`/api/images?publicId=${encodeURIComponent(project.key)}&w=1080&h=720&crop=fill&format=auto&q=auto`}
													alt={project.title}
													fill
													priority
													className="object-cover transition duration-500"
												/>
												<div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/100 pointer-events-none" />
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
			</div>
		</section>
	);
}
