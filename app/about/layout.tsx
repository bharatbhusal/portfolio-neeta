import { Reveal } from "@/components/animations/reveal";
import { PagesProps } from "@/types";

export default function AboutLayout({
	children,
}: PagesProps) {
	return (
		<main>
			<div className="space-y-4">
				<Reveal>
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						About
					</p>
				</Reveal>
				<Reveal>
					<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						About the practice
					</h2>
				</Reveal>
				<Reveal>
					<p className="text-base leading-7 text-muted-foreground">
						Learn about the design philosophy, vision, mission,
						and creative direction.
					</p>
				</Reveal>
			</div>
			<div className="mt-4">{children}</div>
		</main>
	);
}
