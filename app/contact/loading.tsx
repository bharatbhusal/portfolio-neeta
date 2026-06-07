import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
	return (
		<section className="flex gap-4 flex-col sm:flex-row">
			<div className="flex-1 flex gap-4 flex-col">
				<div className="flex gap-2 md:gap-4 flex-wrap">
					{[...Array(6)].map((_, i) => (
						<div
							key={i}
							className="flex items-center gap-2 rounded-lg border border-border/60 bg-background h-8 px-2.5"
						>
							<div className="size-4 rounded-full bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
							<Skeleton width={60} height={14} />
						</div>
					))}
				</div>

				<div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur overflow-hidden">
					<div className="aspect-[4/3] w-full bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
					<div className="p-4 space-y-3">
						<div className="flex items-center justify-between gap-3">
							<Skeleton width="60%" height={20} />
							<Skeleton width={36} height={16} />
						</div>
						<div className="space-y-1.5">
							<Skeleton width="100%" height={14} rows={2} />
						</div>
						<div className="flex flex-wrap gap-2 pt-1">
							<Skeleton width={56} height={22} className="rounded-full" />
							<Skeleton width={72} height={22} className="rounded-full" />
							<Skeleton width={64} height={22} className="rounded-full" />
						</div>
					</div>
				</div>
			</div>

			<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur flex-1">
				<div className="flex items-end justify-between gap-3">
					<div className="space-y-2">
						<Skeleton width={160} height={14} />
						<Skeleton width={200} height={14} />
					</div>
					<Skeleton width={64} height={28} className="rounded-lg" />
				</div>

				<div className="grid gap-4">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="flex rounded-xl border border-border/60 bg-card/70 backdrop-blur overflow-hidden flex-row"
						>
							<div className="flex-1 p-4 space-y-2">
								<Skeleton width="50%" height={20} />
								<Skeleton width="30%" height={12} />
								<div className="space-y-1">
									<Skeleton width="100%" height={12} />
									<Skeleton width="75%" height={12} />
								</div>
								<div className="flex gap-2 hidden md:flex pt-2">
									<Skeleton width={48} height={20} className="rounded-full" />
									<Skeleton width={56} height={20} className="rounded-full" />
								</div>
							</div>
							<div className="hidden md:block w-60 flex-shrink-0 bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
