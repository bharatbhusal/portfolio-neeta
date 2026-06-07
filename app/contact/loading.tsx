import ProjectCardSkeleton from "@/components/cards/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
	return (
		<section className="flex gap-4 flex-col sm:flex-row">
			<div className="flex-1 flex gap-4 flex-col">
				<div className="flex gap-2 md:gap-4 flex-wrap">
					{[...Array(4)].map((_, i) => (
						<Skeleton key={i} width={80} height={28} />
					))}
					<Skeleton width={100} height={28} />
					<Skeleton width={120} height={28} />
				</div>
				<ProjectCardSkeleton />
			</div>

			<div className="space-y-4 rounded-3xl border border-border/60 bg-card/55 p-4 backdrop-blur flex-1">
				<div className="flex items-end justify-between gap-3">
					<div className="space-y-2">
						<Skeleton width={160} height={14} />
						<Skeleton width={200} height={14} />
					</div>
					<Skeleton
						width={64}
						height={28}
						className="rounded-lg"
					/>
				</div>

				<div className="grid gap-4">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="flex rounded-xl border border-border/60 bg-card/70 backdrop-blur overflow-hidden flex-row"
						>
							<div className="flex-1 p-4 space-y-2">
								<Skeleton width="50%" height={32} />
								<Skeleton width="30%" height={20} />
								<div className="space-y-1">
									<Skeleton width="100%" height={12} />
									<Skeleton width="90%" height={12} />
									<Skeleton width="75%" height={12} />
								</div>
								<div className="flex gap-2 hidden md:flex pt-2">
									<Skeleton
										width={48}
										height={20}
										className="rounded-full"
									/>
									<Skeleton
										width={56}
										height={20}
										className="rounded-full"
									/>
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
