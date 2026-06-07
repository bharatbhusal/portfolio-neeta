import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
	return (
		<div className="mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
			<div className="space-y-4">
				<Skeleton rows={4} width="100%" height={16} />
				<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur">
					<Skeleton width="40%" height={14} />
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="aspect-[4/3] rounded-xl bg-slate-200/60 dark:bg-slate-700/40 animate-pulse"
							/>
						))}
					</div>
				</div>
			</div>
			<div className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur">
				<Skeleton width="20%" height={14} />
				<Skeleton rows={3} width="100%" height={16} />
				<div className="h-px bg-border/70" />
				<Skeleton width="20%" height={14} />
				<Skeleton rows={3} width="100%" height={16} />
				<div className="h-px bg-border/70" />
				<Skeleton width="20%" height={14} />
				<div className="grid gap-4 sm:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<Skeleton key={i} width="100%" height={20} />
					))}
				</div>
			</div>
		</div>
	);
}
