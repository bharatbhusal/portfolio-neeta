import Link from "next/link";
import { MdCheck } from "react-icons/md";

import { Button } from "@/components/ui/button";

type ThankYouCardProps = {
	title?: string;
	message?: string;
	primaryLabel?: string;
	primaryHref?: string;
	secondaryLabel?: string;
	secondaryHref?: string;
};

export function ThankYouCard({
	title = "Request Submitted",
	message = "Thank you! Your request has been received. I will review it and get back to you within 48 hours.",
	primaryLabel = "Browse Projects",
	primaryHref = "/projects",
	secondaryLabel = "Back to Home",
	secondaryHref = "/",
}: ThankYouCardProps) {
	return (
		<div className="rounded-2xl border border-border/60 bg-card/60 p-8 shadow-sm text-center space-y-4">
			<div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
				<MdCheck className="size-8 text-primary" />
			</div>
			<h3 className="text-xl font-semibold">{title}</h3>
			<p className="text-muted-foreground max-w-md mx-auto">
				{message}
			</p>
			<div className="flex flex-wrap gap-3 justify-center pt-2">
				<Button asChild variant="outline">
					<Link href={secondaryHref}>{secondaryLabel}</Link>
				</Button>
				<Button asChild>
					<Link href={primaryHref}>{primaryLabel}</Link>
				</Button>
			</div>
		</div>
	);
}
