"use client";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import type {
	ContactChannel,
	SiteData,
} from "@/types/portfolio";
import { Button } from "../ui/button";
import { iconMap } from "@/lib/iconMapper";

type FooterProps = {
	site: SiteData;
};

export function Footer({ site }: FooterProps) {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border/60 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
			<div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="grid gap-8 md:grid-cols-3">
					{/* Brand Section */}
					<div className="space-y-3">
						<Link
							href="/"
							className="group flex flex-col gap-0.5"
						>
							<span className="text-sm font-semibold tracking-[0.24em] uppercase text-foreground/90 transition-colors group-hover:text-foreground">
								{site.name}
							</span>
							<span className="text-xs text-muted-foreground transition-colors group-hover:text-muted-foreground/80">
								{site.role}
							</span>
						</Link>
						<p className="max-w-xs text-sm leading-6 text-muted-foreground">
							{site.tagline}
						</p>
					</div>

					{/* Navigation Section */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
							Navigation
						</h3>
						<nav className="flex flex-col gap-2">
							{site.nav.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-sm text-muted-foreground transition hover:text-foreground"
								>
									{item.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Connect Section */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
							Connect
						</h3>
						<div className="flex gap-2 flex-wrap text-sm text-muted-foreground">
							{site.social.map((channel: ContactChannel) => {
								const IconComponent = iconMap[channel.icon];
								return (
									<Button
										key={channel.label}
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
					</div>
				</div>

				<Separator className="my-6 bg-border/60" />

				{/* Bottom Section */}
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<p className="text-xs text-muted-foreground">
						© {currentYear} {site.name}. All rights reserved.
					</p>
					<p className="text-xs text-muted-foreground">
						{site.location}
					</p>
				</div>
			</div>
		</footer>
	);
}
