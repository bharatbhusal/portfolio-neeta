"use client";

import { ErrorState } from "@/components/ui/error-state";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	return (
		<main className="flex min-h-[50vh] items-center justify-center">
			<div className="space-y-6 text-center">
				<ErrorState
					variant="error"
					title="Something went wrong"
					message={
						error.message ||
						"An unexpected error occurred. Please try again."
					}
				/>
				<button
					onClick={reset}
					className="inline-flex items-center justify-center rounded-lg border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-foreground hover:bg-card transition"
				>
					Try again
				</button>
			</div>
		</main>
	);
}
