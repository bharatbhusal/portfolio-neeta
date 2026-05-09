import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	AboutMeData,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: "Profile | Neeta Bhusal",
		description:
			"Detailed profile of Neeta Bhusal, including creative background and contact pathways.",
		path: "/profile",
	});
}

export default async function ProfilePage() {
	const [site, aboutMe] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<AboutMeData>("/data/aboutMe.json"),
	]);

	return (
		<main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Profile
				</p>
				<h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					{aboutMe.title}
				</h1>
				<p className="text-base leading-7 text-muted-foreground">
					{aboutMe.bio}
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
				<div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border/60">
					<Image
						src={`/api/images?publicId=${encodeURIComponent(site.hero.image)}&w=1200&h=1500&crop=fill&format=auto&q=auto`}
						alt={site.name}
						fill
						className="object-cover"
					/>
				</div>
				<div className="space-y-4 rounded-2xl border border-border/60 bg-card/60 p-6">
					<p className="text-base leading-7 text-muted-foreground">
						{aboutMe.long}
					</p>
					<div className="space-y-1 text-sm text-muted-foreground">
						<p>{site.location}</p>
						<p>{site.email}</p>
						<p>{site.phone}</p>
					</div>
					<div className="flex flex-wrap gap-3">
						<Button asChild>
							<Link href={aboutMe.cta.href}>{aboutMe.cta.label}</Link>
						</Button>
						<Button asChild variant="outline">
							<Link href="/projects">View projects</Link>
						</Button>
					</div>
				</div>
			</div>
		</main>
	);
}
