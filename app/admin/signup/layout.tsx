import { Reveal } from "@/app/animations/reveal";
import { PagesProps } from "@/types";

export default function AdminSignupLayout({
	children,
}: PagesProps) {
	return (
		<main className="mx-auto w-full max-w-lg">
			<div className="space-y-4">
				<Reveal>
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Admin
					</p>
				</Reveal>
				<Reveal>
					<h1 className="text-2xl font-semibold tracking-tight">
						Sign up
					</h1>
				</Reveal>
				<Reveal>
					<p className="text-sm text-muted-foreground">
						Create an admin account to manage projects.
					</p>
				</Reveal>
			</div>
			<div className="mt-4">{children}</div>
		</main>
	);
}
