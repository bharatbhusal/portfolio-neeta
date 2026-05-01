import Link from "next/link";

import { ThemeToggle } from "@/components/layout/theme-toggle";
import type { SiteData } from "@/types/portfolio";

type NavbarProps = {
	site: SiteData;
};

export function Navbar({ site }: NavbarProps) {
	return (
		<header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between gap-4">
					<Link href="/" className="group flex flex-col gap-0.5">
						<span className="text-sm font-semibold tracking-[0.24em] uppercase text-foreground/90">
							{site.name}
						</span>
						<span className="text-xs text-muted-foreground">
							{site.role}
						</span>
					</Link>

					<div className="flex items-center gap-2">
						<ThemeToggle />
					</div>
				</div>

				<nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
					{site.nav.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-border hover:bg-secondary hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
				</nav>
			</div>
		</header>
	);
}
