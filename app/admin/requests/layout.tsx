import { PagesProps } from "@/types";

export default function AdminRequestsLayout({
	children,
}: PagesProps) {
	return (
		<main>
			<div className="mb-4 space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Admin / Project Requests
				</p>
				<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Incoming Requests
				</h2>
			</div>
			{children}
		</main>
	);
}
