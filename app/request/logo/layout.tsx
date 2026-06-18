import { Reveal } from "@/app/animations/reveal";
import { PagesProps } from "@/types";

export default function LogoRequestLayout({
	children,
}: PagesProps) {
	return (
		<main>
			<div className="space-y-4">
				<Reveal>
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Request a Logo Design
					</p>
				</Reveal>
				<Reveal>
					<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						Let&apos; create your brand identity.
					</h2>
				</Reveal>
				<Reveal>
					<p className="max-w-xl text-base leading-7 text-muted-foreground">
						Fill out the details below and I&apos;ll get back to you
						within 48 hours with ideas and a quote.
					</p>
				</Reveal>
			</div>
			<div className="mt-4">{children}</div>
		</main>
	);
}
