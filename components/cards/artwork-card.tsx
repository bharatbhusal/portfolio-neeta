import Image from "next/image";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Artwork } from "@/types/portfolio";

type ArtworkCardProps = {
	artwork: Artwork;
};

export function ArtworkCard({ artwork }: ArtworkCardProps) {
	return (
		<Card
			data-hover-lift
			className="group h-full border-border/60 bg-card/70 backdrop-blur"
		>
			<div className="relative aspect-square overflow-hidden border-b border-border/60">
				<Image
					src={artwork.image}
					alt={artwork.title}
					fill
					className="object-cover transition duration-700 group-hover:scale-105"
					sizes="(min-width: 1024px) 25vw, 100vw"
				/>
			</div>
			<CardHeader>
				<div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-muted-foreground">
					<span>{artwork.category}</span>
					<span>{artwork.year}</span>
				</div>
				<CardTitle className="text-lg">
					{artwork.title}
				</CardTitle>
				<CardDescription className="leading-6">
					{artwork.summary}
				</CardDescription>
			</CardHeader>
			<CardContent />
		</Card>
	);
}
