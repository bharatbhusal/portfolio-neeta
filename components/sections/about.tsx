"use client";

import Link from "next/link";
import { useRef } from "react";

import { Reveal } from "@/components/animations/reveal";
import { ProjectCardBox } from "@/components/cards/project-card-box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGSAP } from "@/hooks/useGSAP";
import type { Project, SiteData } from "@/types/portfolio";

type AboutContentProps = {
	site: SiteData;
	featuredProjects: Project[];
};

export function AboutContent({
	site,
	featuredProjects,
}: AboutContentProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

	return (
		<section ref={scopeRef}>
			<div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
				<div className="space-y-4">
					<Reveal>
						<p className="max-w-xl text-base leading-7 text-muted-foreground">
							{site.about.bio}
						</p>
					</Reveal>

					<Reveal>
						{featuredProjects.length > 0 && (
							<div className="grid gap-6">
								<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur">
									<div className="flex items-end justify-between gap-3">
										<div className="space-y-2">
											<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
												Featured projects
											</p>
											<p className="text-sm leading-6 text-muted-foreground">
												A short selection from the current portfolio.
											</p>
										</div>
										<Button asChild variant="outline" size="sm">
											<Link href="/projects?featured=true">View all</Link>
										</Button>
									</div>

									<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
										{featuredProjects.map((project) => (
											<ProjectCardBox
												key={project.key}
												project={project}
											/>
										))}
									</div>
								</div>
							</div>
						)}
					</Reveal>
				</div>

				<div className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur">
					<p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
						Vision
					</p>
					<p className="text-lg leading-8">
						{site.about.vision}
					</p>

					<Separator className="bg-border/70" />

					<p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
						Mission
					</p>
					<p className="text-base leading-7 text-muted-foreground">
						{site.about.mission}
					</p>

					<Separator className="bg-border/70" />

					<p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">
						Values
					</p>
					<div className="grid gap-4 sm:grid-cols-3">
						{site.about.values.map((value) => (
							<li
								key={value}
								className="ml-4 text-muted-foreground"
							>
								{value}
							</li>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
