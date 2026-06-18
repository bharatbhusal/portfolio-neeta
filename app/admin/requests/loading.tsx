import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRequestsLoading() {
	return (
		<div className="space-y-4">
			{[...Array(5)].map((_, i) => (
				<div
					key={i}
					className="rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm space-y-3"
				>
					<div className="flex items-center justify-between">
						<Skeleton width={200} height={20} />
						<Skeleton width={80} height={24} />
					</div>
					<Skeleton width="60%" height={14} />
					<Skeleton width="40%" height={14} />
				</div>
			))}
		</div>
	);
}
