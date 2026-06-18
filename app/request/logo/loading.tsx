import { Skeleton } from "@/components/ui/skeleton";

export default function LogoRequestLoading() {
	return (
		<div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm space-y-6">
			<div className="space-y-2">
				<Skeleton width={160} height={14} />
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Skeleton width={80} height={12} />
					<Skeleton width="100%" height={36} />
				</div>
				<div className="space-y-2">
					<Skeleton width={100} height={12} />
					<Skeleton width="100%" height={36} />
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Skeleton width={60} height={12} />
					<Skeleton width="100%" height={36} />
				</div>
				<div className="space-y-2">
					<Skeleton width={100} height={12} />
					<Skeleton width="100%" height={36} />
				</div>
			</div>
			<Skeleton width={120} height={36} />
		</div>
	);
}
