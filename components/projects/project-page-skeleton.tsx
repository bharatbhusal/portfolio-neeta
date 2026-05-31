"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectPageSkeleton() {
	return (
		<section className="mx-auto w-full max-w-5xl space-y-6 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
			<div className="space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Project
				</p>

				<div className="flex flex-col gap-3">
					<Skeleton height={36} width={"50%"} />
					<Skeleton height={28} width={"20%"} />
					<div className="flex gap-3">
						<Skeleton height={20} width={"15%"} />.
						<Skeleton height={20} width={"15%"} />
					</div>
				</div>

				<div className="w-full flex flex-wrap justify-between text-sm text-muted-foreground text-center">
					<div>
						<Skeleton width={"30%"} height={14} />
					</div>
					<div>
						<Skeleton width={"25%"} height={14} />
					</div>
				</div>
			</div>

			<div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60">
				<div className="absolute inset-0">
					<Skeleton width={"100%"} height={"100%"} />
				</div>
			</div>

			<div className="space-y-4 rounded-2xl border border-border/60 bg-card/50 p-6">
				<div>
					<Skeleton rows={4} height={18} />
				</div>
				<div>
					<Skeleton rows={2} height={16} />
				</div>
				<div className="flex flex-wrap gap-3">
					<div className="h-8 w-28 rounded-lg bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
					<div className="h-8 w-28 rounded-lg bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
					<div className="h-8 w-28 rounded-lg bg-slate-200/60 dark:bg-slate-700/40 animate-pulse" />
				</div>
			</div>
		</section>
	);
}

export default ProjectPageSkeleton;
