import { ProjectCardSkeleton } from "@/components/cards/project-card-skeleton";

export default function ProjectsLoading() {
	return (
		<main className="pb-8 lg:pb-12">
			<section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{Array.from({ length: 9 }).map((_, index) => (
						<ProjectCardSkeleton key={index} />
					))}
				</div>
			</section>
		</main>
	);
}
