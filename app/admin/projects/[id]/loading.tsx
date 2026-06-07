import { Skeleton } from "@/components/ui/skeleton";

export default function EditProjectLoading() {
	return (
		<div className="grid gap-6">
			<div className="space-y-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
				<div className="space-y-2">
					<Skeleton width={100} height={14} />
					<div className="flex justify-center">
						<div className="w-[250px] h-[250px] rounded-md bg-muted m-2 bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
					</div>
				</div>

				{[...Array(2)].map((_, i) => (
					<div key={i} className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Skeleton width={60} height={14} />
							<Skeleton
								width="100%"
								height={40}
								className="rounded-lg"
							/>
						</div>
						<div className="space-y-2">
							<Skeleton width={80} height={14} />
							<Skeleton
								width="100%"
								height={40}
								className="rounded-lg"
							/>
						</div>
					</div>
				))}

				<div className="space-y-2">
					<Skeleton width={80} height={14} />
					<Skeleton
						width="100%"
						height={40}
						className="rounded-lg"
					/>
				</div>

				<div className="space-y-2">
					<Skeleton width={40} height={14} />
					<Skeleton
						width="100%"
						height={40}
						className="rounded-lg"
					/>
				</div>

				{[...Array(2)].map((_, i) => (
					<div key={i} className="space-y-2">
						<Skeleton width={60} height={14} />
						<div className="space-y-1">
							<Skeleton
								width="100%"
								height={80}
								className="rounded-lg"
							/>
						</div>
					</div>
				))}

				<div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/70 px-3 py-3">
					<div className="space-y-1">
						<Skeleton width={120} height={14} />
						<Skeleton width={240} height={12} />
					</div>
				</div>

				<div className="flex flex-wrap gap-3">
					<Skeleton
						width={110}
						height={36}
						className="rounded-lg"
					/>
					<Skeleton
						width={150}
						height={36}
						className="rounded-lg"
					/>
				</div>
			</div>
		</div>
	);
}
