"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/animations/reveal";
import { ProjectCardBox } from "@/components/cards/project-card-box";
import { Button } from "@/components/ui/button";
import { SocialLinks } from "@/components/social-links";
import { useGSAP } from "@/hooks/useGSAP";
import type {
	Project,
	SocialLink,
} from "@/types/portfolio";
import { ProjectCardLinear } from "../cards/project-card-linear";

type ContactContentProps = {
	social: SocialLink[];
	featuredProject: Project | null;
	clientProjects: Project[];
};

export function ContactContent({
	social,
	featuredProject,
	clientProjects,
}: ContactContentProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

	return (
		<section
			ref={scopeRef}
			className="flex gap-4 flex-col sm:flex-row"
		>
			<div className="flex-1">
				<Reveal>
					<div className="flex gap-2 md:gap-4 flex-wrap">
						<SocialLinks socials={social} />
					</div>
				</Reveal>
				{featuredProject && (
					<Reveal>
						<ProjectCardBox project={featuredProject} />
					</Reveal>
				)}
			</div>

			{clientProjects.length > 0 && (
				<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur flex-1">
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
							<ProjectCardLinear
								key={project._id}
								project={project}
							/>
						))}
					</div>
				</div>
			)}
		</section>
	);
}
