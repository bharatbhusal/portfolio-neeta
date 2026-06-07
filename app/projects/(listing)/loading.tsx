import { ProjectCardSkeleton } from "@/components/cards/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsListingLoading() {
	return (
		<div className="space-y-8">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-2">
					<div className="inline-flex items-center -space-x-px">
						<Skeleton width={150} height={28} />
					</div>
					<div className="inline-flex items-center -space-x-px">
						<Skeleton width={150} height={28} />
					</div>
					<Skeleton
						width={80}
						height={28}
						className="rounded-lg"
					/>
				</div>
				<Skeleton
					width={240}
					height={36}
					className="rounded-full"
				/>
			</div>

			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<ProjectCardSkeleton key={i} />
				))}
			</div>

			<div className="flex items-center justify-between gap-3">
				<Skeleton
					width={80}
					height={28}
					className="rounded-lg"
				/>
				<Skeleton width={100} height={14} />
				<Skeleton
					width={64}
					height={28}
					className="rounded-lg"
				/>
			</div>
		</div>
	);
}
