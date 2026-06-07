import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSignupLoading() {
	return (
		<div className="mt-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
			<div className="space-y-5">
				<div className="space-y-2">
					<Skeleton width={60} height={14} />
					<Skeleton width="100%" height={40} />
				</div>
				<div className="space-y-2">
					<Skeleton width={80} height={14} />
					<Skeleton width="100%" height={40} />
				</div>
				<div className="space-y-2">
					<Skeleton width={80} height={14} />
					<Skeleton width="100%" height={40} />
				</div>
				<Skeleton width={140} height={40} />
				<Skeleton width={"70%"} height={20} />
			</div>
		</div>
	);
}
