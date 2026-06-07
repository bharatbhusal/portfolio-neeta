"use client";

import { useRef } from "react";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCard } from "@/components/cards/project-card";
import { Button } from "@/components/ui/button";
import { useGSAP } from "@/hooks/useGSAP";
import { SocialLink } from "@/types/portfolio";
import Image from "next/image";
import Link from "next/link";
import {
	useClientProjects,
	useFeaturedProjects,
} from "@/hooks/useApi";
import Skeleton from "@/components/ui/skeleton";
import ProjectCardSkeleton from "@/components/cards/project-card-skeleton";
import { SocialLinks } from "../social-links";

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
		<section ref={scopeRef} className="">
			<div className="grid gap-8">
				{/* Channels with Icons */}
				<Reveal>
					<div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
						<SocialLinks socials={social} />
					</div>
				</Reveal>

				{/* Client Projects Section */}
				{!isFeaturedProjectLoading ? (
					featuredProject && (
						<Reveal>
							<ProjectCard project={featuredProject[0]} />
						</Reveal>
					)
				) : (
					<ProjectCardSkeleton />
				)}

				{/* Featured Project on Right */}
				{!isClientProjectsLoading ? (
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
									<Link
										key={project.key}
										href={`/projects/${encodeURIComponent(project._id)}`}
										className="group block rounded-xl border border-border/60 bg-background/40 p-4 hover:bg-background/60 transition"
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
													{project.description}
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
									</Link>
								))}
							</div>
						</div>
					)
				) : (
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
						</div>

						<div className="grid gap-4">
							{Array.from({ length: 4 }).map((_, i) => (
								<div
									key={i}
									className="group rounded-xl border border-border/60 bg-background/40 p-4"
								>
									<div className="flex">
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-3 mb-2">
												<div className="flex-1 min-w-0">
													<div className="mb-1">
														<Skeleton height={16} width={"70%"} />
													</div>
													<div>
														<Skeleton height={12} width={"40%"} />
													</div>
												</div>
											</div>
											<div>
												<Skeleton rows={2} height={12} />
											</div>
										</div>
										<div className="relative hidden sm:block w-28 sm:w-36 md:w-44 aspect-[16/9] overflow-hidden rounded-r-md flex-shrink-0">
											<div className="absolute inset-0">
												<Skeleton width={"100%"} height={"100%"} />
											</div>
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

export default Contact;
