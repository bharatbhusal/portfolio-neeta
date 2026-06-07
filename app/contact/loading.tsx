import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
	return (
		<div className="grid gap-8 mt-8">
			<div className="grid gap-3 grid-cols-2 sm:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/55 p-4 backdrop-blur"
					>
						<Skeleton width={20} height={20} className="rounded-full" />
						<Skeleton width="60%" height={14} />
					</div>
				))}
			</div>
			<div className="aspect-[4/3] rounded-2xl border border-border/60 bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
			<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur">
				<Skeleton width="40%" height={14} />
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className="flex gap-3 rounded-xl border border-border/60 bg-background/40 p-4"
					>
						<div className="flex-1 space-y-2">
							<Skeleton width="50%" height={16} />
							<Skeleton rows={2} width="100%" height={12} />
						</div>
						<Skeleton
							width={120}
							height={68}
							className="rounded-r-md"
						/>
					</div>
				))}
			</div>
		</div>
	);
}
