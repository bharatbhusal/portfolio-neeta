import { Reveal } from "@/app/animations/reveal";
import { PagesProps } from "@/types";

export default async function ContactsLayout({
	children,
}: PagesProps) {
	return (
		<main>
			<div className="space-y-4">
				<Reveal>
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Contact
					</p>
				</Reveal>
				<Reveal>
					<h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
						Let’s build something measured and memorable.
					</h2>
				</Reveal>
				<Reveal>
					<p className="max-w-xl text-base leading-7 text-muted-foreground">
						Open for select collaborations, freelance engagements,
						and creative direction partnerships.
					</p>
				</Reveal>
			</div>
			<div className="mt-4">{children}</div>
		</main>
	);
}
