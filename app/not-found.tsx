import Link from "next/link";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
	return (
		<main className="flex min-h-[50vh] items-center justify-center">
			<div className="space-y-6 text-center">
				<ErrorState
					variant="not-found"
					title="Page not found"
					message="The page you're looking for doesn't exist or has been moved."
				/>
				<Button asChild variant="outline" size="sm">
					<Link href="/">Go home</Link>
				</Button>
			</div>
		</main>
	);
}
