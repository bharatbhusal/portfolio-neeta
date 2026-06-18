import Link from "next/link";
import { MdMail, MdFolderOpen } from "react-icons/md";
import { getProjectRequestStatsController } from "@/controllers/projectRequests";
import { getProjectStatsController } from "@/controllers/projects";
import { StatCard } from "@/components/cards/stat-card";

export const revalidate = 0;

export default async function AdminDashboardPage() {
	const requestStats =
		await getProjectRequestStatsController();
	const projectStats = await getProjectStatsController();

	return (
		<div className="space-y-8">
			<div className="space-y-2">
				<h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
					Dashboard
				</h2>
				<p className="text-muted-foreground">
					Overview of projects and incoming requests.
				</p>
			</div>

			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						Projects
					</h3>
				</div>
				<div className="flex flex-wrap gap-4">
					<StatCard
						label="Total Projects"
						value={projectStats.total}
						href="/projects"
					/>
					<StatCard
						label="Featured"
						value={projectStats.featured}
						percentOfTotal={
							projectStats.total > 0
								? (projectStats.featured / projectStats.total) * 100
								: 0
						}
						href="/projects?page=1&featured=true&sortBy=createdAt&sortOrder=asc"
					/>
					<StatCard
						label="Client Projects"
						value={projectStats.clientProjects}
						percentOfTotal={
							projectStats.total > 0
								? (projectStats.clientProjects /
										projectStats.total) *
									100
								: 0
						}
						href="/projects?page=1&client=true&sortBy=createdAt&sortOrder=asc"
					/>
					<StatCard
						label="Categories"
						value={projectStats.categories}
					/>
				</div>
			</section>

			<section className="space-y-3">
				<div className="flex items-center justify-between">
					<h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						Requests
					</h3>
				</div>
				<div className="flex flex-wrap gap-4">
					<StatCard
						label="Total Requests"
						value={requestStats.total}
						href="/admin/requests"
					/>
					<StatCard
						label="Pending"
						value={requestStats.pending}
						percentOfTotal={
							requestStats.total > 0
								? (requestStats.pending / requestStats.total) * 100
								: 0
						}
						href="/admin/requests?status=pending"
					/>
					<StatCard
						label="Reviewed"
						value={requestStats.reviewed}
						percentOfTotal={
							requestStats.total > 0
								? (requestStats.reviewed / requestStats.total) * 100
								: 0
						}
						href="/admin/requests?status=reviewed"
					/>
					<StatCard
						label="Accepted"
						value={requestStats.accepted}
						percentOfTotal={
							requestStats.total > 0
								? (requestStats.accepted / requestStats.total) * 100
								: 0
						}
						href="/admin/requests?status=accepted"
					/>
					<StatCard
						label="Declined"
						value={requestStats.declined}
						percentOfTotal={
							requestStats.total > 0
								? (requestStats.declined / requestStats.total) * 100
								: 0
						}
						href="/admin/requests?status=declined"
					/>
				</div>
			</section>

			<section className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm space-y-1">
				<p className="text-sm text-muted-foreground">
					Analytics data is available on your{" "}
					<a
						href="https://vercel.com/bharatbhusals-projects/portfolio-neeta/analytics"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						Vercel Dashboard
					</a>
					.
				</p>
			</section>
		</div>
	);
}
