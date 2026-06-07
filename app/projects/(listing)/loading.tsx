import { ProjectCardSkeleton } from "@/components/cards/project-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsListingLoading() {
	return (
		<div className="space-y-8 mt-8">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="flex flex-wrap gap-2">
					{[...Array(5)].map((_, i) => (
						<Skeleton
							key={i}
							width={80}
							height={32}
							className="rounded-full"
						/>
					))}
				</div>
				<Skeleton
					width={200}
					height={36}
					className="rounded-full"
				/>
			</div>
			<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{[...Array(6)].map((_, i) => (
					<ProjectCardSkeleton key={i} />
				))}
			</div>
		</div>
	);
}
