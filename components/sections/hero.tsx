"use client";

import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";
import { useRef } from "react";

import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGSAP } from "@/hooks/useGSAP";
import type { SiteData } from "@/types/portfolio";

type HeroProps = {
	site: SiteData;
};

export function Hero({ site }: HeroProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl"
		>
			<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
				<div className="space-y-6">
					<Reveal>
						<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
							{site.hero.eyebrow}
						</p>
					</Reveal>

					<div className="space-y-5">
						<Reveal>
							<h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl lg:text-7xl">
								{site.hero.title}
							</h1>
						</Reveal>
						<Reveal>
							<p className="max-w-2xl text-lg leading-8 text-muted-foreground lg:text-xl">
								{site.hero.summary}
							</p>
						</Reveal>
						<Reveal>
							<p className="max-w-xl text-sm leading-6 text-foreground/80">
								{site.hero.accent}
							</p>
						</Reveal>
					</div>

					<Reveal className="flex flex-wrap gap-3">
						{site.hero.actions.map((action) => (
							<Button
								key={action.href}
								asChild
								variant={action.variant}
								size="lg"
							>
								<Link href={action.href}>
									{action.label}
									<MdArrowOutward className="size-4" />
								</Link>
							</Button>
						))}
					</Reveal>

					<div className="flex gap-3">
						{site.about.stats.map((stat) => (
							<div
								key={stat.label}
								data-reveal
								className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur w-full"
							>
								<p className="text-sm text-muted-foreground">
									{stat.label}
								</p>
								<p className="mt-2 text-2xl font-semibold tracking-tight">
									{stat.value}
								</p>
							</div>
						))}
					</div>
				</div>

				<Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur">
					<div className="relative aspect-[4/5] overflow-hidden border-b border-border/60">
						<Image
							src={`/api/images?publicId=${encodeURIComponent(site.hero.image)}&w=1000&h=1200&crop=fill&format=auto&q=auto`}
							alt={site.name}
							fill
							className="object-cover"
							priority
							sizes="(min-width: 1024px) 40vw, 100vw"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
					</div>
					<CardContent className="space-y-6 py-2">
						<div className="space-y-2">
							<p className="text-lg font-medium">{site.name}</p>
							<p className="text-sm leading-6 text-muted-foreground">
								{site.about.bio}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
