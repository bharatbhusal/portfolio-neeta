"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { SiteData } from "@/types/portfolio";

type NavbarProps = {
	site: SiteData;
};

export function Navbar({ site }: NavbarProps) {
	const pathname = usePathname() || "/";

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
				</div>

				<nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
					{site.nav.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/" &&
								pathname.startsWith(item.href.split("?")[0]));

						return (
							<Link
								key={item.href}
								href={item.href}
								className={
									`rounded-full px-3 py-1.5 transition ` +
									(isActive
										? "border border-border bg-secondary text-foreground"
										: "border border-transparent hover:border-border hover:bg-secondary hover:text-foreground")
								}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
