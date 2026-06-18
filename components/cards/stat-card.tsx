import Link from "next/link";

type StatCardProps = {
	label: string;
	value: number | string;
	percentOfTotal?: number;
	href?: string;
};

export function StatCard({
	label,
	value,
	percentOfTotal,
	href,
}: StatCardProps) {
	const inner = (
		<div
			className={`rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm space-y-1 ${href ? "hover:border-foreground/30 transition-colors" : ""}`}
		>
			<p className="text-3xl font-semibold">{value}</p>
			<p className="text-sm text-muted-foreground">{label}</p>
			{typeof percentOfTotal === "number" && (
				<p className="text-xs text-muted-foreground/60">
					{percentOfTotal.toFixed(1)}% of total
				</p>
			)}
		</div>
	);

	if (href) {
		return <Link href={href}>{inner}</Link>;
	}

	return inner;
}
