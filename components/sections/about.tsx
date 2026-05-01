"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { ArtworkCard } from "@/components/cards/artwork-card";
import { Reveal } from "@/components/animations/reveal";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGSAP } from "@/hooks/useGSAP";
import type {
	Artwork,
	Photograph,
	SiteData,
} from "@/types/portfolio";

type AboutProps = {
	site: SiteData;
	artworks: Artwork[];
	photographs: Photograph[];
	compact?: boolean;
};

export function About({
	site,
	artworks,
	photographs,
	compact = false,
}: AboutProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

	const headline = compact ? "About" : "About the practice";

	return (
		<section
			ref={scopeRef}
			className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
		>
			<div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
				<div className="space-y-6">
					<Reveal>
						<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
							{headline}
						</p>
					</Reveal>
					<Reveal>
						<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
							Minimal systems, artistic detail, and a clear point
							of view.
						</h2>
					</Reveal>
					<Reveal>
						<p className="max-w-xl text-base leading-7 text-muted-foreground">
							{site.about.bio}
						</p>
					</Reveal>

					<Reveal>
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
						</div>
					</Reveal>

					<Reveal className="flex flex-wrap gap-3">
						<Button asChild size="lg">
							<Link href="/about">Read more</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href="/contact">Collaborate</Link>
						</Button>
					</Reveal>
				</div>

				<div className="grid gap-6">
					<div className="grid gap-4 sm:grid-cols-3">
						{site.about.values.map((value) => (
							<div
								key={value}
								data-reveal
								className="rounded-2xl border border-border/60 bg-card/60 p-4 text-sm leading-6 text-muted-foreground backdrop-blur"
							>
								{value}
							</div>
						))}
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						{site.about.stats.map((stat) => (
							<Card
								key={stat.label}
								data-hover-lift
								className="border-border/60 bg-card/70 backdrop-blur"
							>
								<CardHeader>
									<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
										{stat.label}
									</p>
									<CardTitle className="text-3xl">
										{stat.value}
									</CardTitle>
								</CardHeader>
								<CardContent className="pb-4 text-sm text-muted-foreground">
									Strategic, scalable, and design-aware.
								</CardContent>
							</Card>
						))}
					</div>

					<div className="grid gap-4 lg:grid-cols-2">
						{artworks.slice(0, 2).map((artwork) => (
							<ArtworkCard key={artwork.title} artwork={artwork} />
						))}
					</div>

					<div className="grid gap-4 lg:grid-cols-2">
						{photographs.slice(0, 2).map((photo) => (
							<Card
								key={photo.title}
								data-hover-lift
								className="overflow-hidden border-border/60 bg-card/70 backdrop-blur"
							>
								<div className="relative aspect-[4/3] overflow-hidden border-b border-border/60">
									<Image
										src={photo.image}
										alt={photo.title}
										fill
										className="object-cover"
										sizes="(min-width: 1024px) 25vw, 100vw"
									/>
								</div>
								<CardHeader>
									<div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
										<span>{photo.location}</span>
										<span>{photo.year}</span>
									</div>
									<CardTitle className="text-lg">
										{photo.title}
									</CardTitle>
								</CardHeader>
								<CardContent className="pb-4 text-sm leading-6 text-muted-foreground">
									{photo.summary}
								</CardContent>
							</Card>
						))}
					</div>

					{!compact ? (
						<Separator className="bg-border/70" />
					) : null}
				</div>
			</div>
		</section>
	);
}
