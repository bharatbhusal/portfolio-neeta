"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

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
	ContactData,
	SiteData,
} from "@/types/portfolio";

type ContactProps = {
	site: SiteData;
	contact: ContactData;
	compact?: boolean;
};

export function Contact({
	site,
	contact,
	compact = false,
}: ContactProps) {
	const scopeRef = useRef<HTMLElement | null>(null);
	useGSAP({ scope: scopeRef });

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
							{contact.heading}
						</h2>
					</Reveal>
					<Reveal>
						<p className="max-w-xl text-base leading-7 text-muted-foreground">
							{contact.summary}
						</p>
					</Reveal>
					<Reveal>
						<p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
							{contact.availability}
						</p>
					</Reveal>

					<Reveal className="flex flex-wrap gap-3">
						<Button asChild size="lg">
							<Link
								href={`/api/vcard?name=${encodeURIComponent(site.name)}`}
							>
								Download vCard
							</Link>
						</Button>
						<Button asChild variant="outline" size="lg">
							<Link href={`mailto:${site.email}`}>Email</Link>
						</Button>
					</Reveal>
				</div>

				<div className="space-y-4">
					<Card
						data-hover-lift
						className="border-border/60 bg-card/70 backdrop-blur"
					>
						<CardHeader>
							<CardTitle className="text-xl">
								Contact details
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 text-sm text-muted-foreground">
							<div className="flex items-center justify-between gap-4">
								<span>Email</span>
								<Link
									className="text-foreground transition hover:text-primary"
									href={`mailto:${site.email}`}
								>
									{site.email}
								</Link>
							</div>
							<Separator className="bg-border/70" />
							<div className="flex items-center justify-between gap-4">
								<span>Phone</span>
								<Link
									className="text-foreground transition hover:text-primary"
									href={`tel:${site.phone}`}
								>
									{site.phone}
								</Link>
							</div>
							<Separator className="bg-border/70" />
							<div className="flex items-center justify-between gap-4">
								<span>Location</span>
								<span className="text-foreground">
									{site.location}
								</span>
							</div>
						</CardContent>
					</Card>
					<Card className="border-border/60 bg-card/60 backdrop-blur">
						<CardHeader>
							<CardTitle className="text-lg">
								vCard QR
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="relative mx-auto size-40 overflow-hidden rounded-xl border border-border/60 bg-background">
								<Image
									src="/api/vcard/qr"
									alt="QR code to download Neeta vCard"
									fill
									className="object-contain p-2"
								/>
							</div>
							<p className="text-center text-xs text-muted-foreground">
								Scan to download the contact card.
							</p>
						</CardContent>
					</Card>

					<div className="grid gap-4 sm:grid-cols-3">
						{contact.channels.map((channel) => (
							<Card
								key={channel.label}
								data-hover-lift
								className="border-border/60 bg-card/60 backdrop-blur"
							>
								<CardHeader>
									<p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
										{channel.label}
									</p>
									<CardTitle className="text-base">
										Connect
									</CardTitle>
								</CardHeader>
								<CardContent className="pb-4 text-sm text-muted-foreground">
									<Link
										href={channel.href}
										target="_blank"
										rel="noreferrer"
										className="transition hover:text-foreground"
									>
										Open
									</Link>
								</CardContent>
							</Card>
						))}
					</div>

					{!compact ? (
						<Card className="border-border/60 bg-card/50 backdrop-blur">
							<CardContent className="py-6 text-sm leading-7 text-muted-foreground">
								{site.description}
							</CardContent>
						</Card>
					) : null}
				</div>
			</div>
		</section>
	);
}
