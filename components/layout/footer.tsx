import Link from "next/link";

import type {
	ContactData,
	SiteData,
} from "@/types/portfolio";

type FooterProps = {
	site: SiteData;
	contact: ContactData;
};

export function Footer({ site, contact }: FooterProps) {
	return (
		<footer className="border-t border-border/60 bg-background/80">
			<div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.4fr_0.8fr_0.8fr] lg:px-8">
				<div className="space-y-3">
					<p className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground/90">
						{site.name}
					</p>
					<p className="max-w-xl text-sm leading-6 text-muted-foreground">
						{site.description}
					</p>
				</div>

				<div className="space-y-3 text-sm">
					<p className="font-medium text-foreground">Explore</p>
					<div className="flex flex-col gap-2 text-muted-foreground">
						{site.nav.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="transition hover:text-foreground"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>

				<div className="space-y-3 text-sm">
					<p className="font-medium text-foreground">Contact</p>
					<div className="flex flex-col gap-2 text-muted-foreground">
						<Link
							href={`mailto:${contact.email}`}
							className="transition hover:text-foreground"
						>
							{contact.email}
						</Link>
						<Link
							href={`tel:${contact.phone}`}
							className="transition hover:text-foreground"
						>
							{contact.phone}
						</Link>
						<span>{contact.location}</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
