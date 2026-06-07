import Link from "next/link";
import { FiAlertCircle, FiSearch, FiFolder } from "react-icons/fi";
import { Button } from "@/components/ui/button";

type ErrorStateVariant = "empty" | "not-found" | "error";

type ErrorStateProps = {
	variant?: ErrorStateVariant;
	title?: string;
	message?: string;
	action?: {
		label: string;
		href: string;
	};
};

const defaultConfig: Record<
	ErrorStateVariant,
	{ icon: React.ReactNode; title: string; message: string }
> = {
	"not-found": {
		icon: <FiAlertCircle className="size-8" />,
		title: "Not found",
		message: "The requested resource could not be found.",
	},
	empty: {
		icon: <FiSearch className="size-8" />,
		title: "Nothing here",
		message: "No items match your current criteria.",
	},
	error: {
		icon: <FiFolder className="size-8" />,
		title: "Something went wrong",
		message: "An unexpected error occurred. Please try again.",
	},
};

export function ErrorState({
	variant = "error",
	title,
	message,
	action,
}: ErrorStateProps) {
	const config = defaultConfig[variant];

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
			<div className="text-muted-foreground">{config.icon}</div>
			<div className="space-y-2">
				<p className="text-lg font-semibold">
					{title ?? config.title}
				</p>
				<p className="max-w-md text-sm text-muted-foreground">
					{message ?? config.message}
				</p>
			</div>
			{action && (
				<Button asChild variant="outline" size="sm">
					<Link href={action.href}>{action.label}</Link>
				</Button>
			)}
		</div>
	);
}
