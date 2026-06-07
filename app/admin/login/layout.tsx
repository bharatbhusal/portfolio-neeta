import { Reveal } from "@/app/animations/reveal";
import { PagesProps } from "@/types";

export default function AdminLoginLayout({
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
						Sign in
					</h1>
				</Reveal>
				<Reveal>
					<p className="text-sm text-muted-foreground">
						Use your admin credentials to manage projects.
					</p>
				</Reveal>
			</div>
			<div className="mt-6">{children}</div>
		</main>
	);
}
