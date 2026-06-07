import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
	return (
		<section>
			<div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
				<div className="space-y-4">
					<Skeleton width="100%" height={16} rows={3} />

					<div className="grid gap-6">
						<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur">
							<div className="flex items-end justify-between gap-3">
								<div className="space-y-2">
									<Skeleton width={140} height={14} />
									<Skeleton width={240} height={14} />
								</div>
								<Skeleton
									width={64}
									height={28}
									className="rounded-lg"
								/>
							</div>

							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{[...Array(3)].map((_, i) => (
									<div
										key={i}
										className="rounded-xl border border-border/60 bg-card/70 backdrop-blur overflow-hidden"
									>
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
												<Skeleton
													width={56}
													height={22}
													className="rounded-full"
												/>
												<Skeleton
													width={72}
													height={22}
													className="rounded-full"
												/>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-6 backdrop-blur">
					<Skeleton width={48} height={14} />
					<Skeleton width="100%" height={20} rows={2} />

					<div className="h-px bg-border/70" />

					<Skeleton width={56} height={14} />
					<Skeleton width="100%" height={16} rows={3} />

					<div className="h-px bg-border/70" />

					<Skeleton width={48} height={14} />
					<div className="grid gap-4 sm:grid-cols-3">
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} width="100%" height={20} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
