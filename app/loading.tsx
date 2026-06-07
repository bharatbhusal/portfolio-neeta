import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
	return (
		<section className="mx-auto w-full max-w-7xl">
			<div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
				<div className="space-y-6">
					<Skeleton width={220} height={20} />

					<div className="space-y-5">
						<div className="space-y-2">
							<Skeleton width="90%" height={48} />
							<Skeleton width="75%" height={48} />
							<Skeleton width="75%" height={48} />
							<Skeleton width="55%" height={48} />
						</div>
						<Skeleton width="75%" height={20} rows={2} />
						<Skeleton width="50%" height={14} />
					</div>

					<div className="flex flex-wrap gap-3">
						<Skeleton
							width={140}
							height={40}
							className="rounded-lg"
						/>
						<Skeleton
							width={160}
							height={40}
							className="rounded-lg"
						/>
					</div>

					<div className="flex gap-3">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur w-full"
							>
								<Skeleton width="60%" height={14} />
								<Skeleton
									width="40%"
									height={28}
									className="mt-2"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-xl border border-border/60 bg-card/70 backdrop-blur overflow-hidden">
					<div className="aspect-[4/5] w-full bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
					<div className="p-6 space-y-2">
						<Skeleton width="50%" height={20} />
						<Skeleton width="100%" height={14} rows={2} />
					</div>
				</div>
			</div>
		</section>
	);
}
