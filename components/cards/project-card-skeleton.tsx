"use client";

import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectCardSkeleton() {
	return (
		<Card className="h-full border-border/60 bg-card/70 backdrop-blur">
			<div className="relative aspect-[4/3] overflow-hidden border-b border-border/60">
				<Skeleton
					width="100%"
					height="100%"
					className="absolute inset-0"
				/>
				<div className="absolute left-4 top-4">
					<Skeleton
						width={80}
						height={24}
						className="rounded-full"
					/>
				</div>
			</div>

			<CardHeader>
				<div className="mb-2">
					<Skeleton width="60%" height={20} />
				</div>
				<div>
					<Skeleton rows={2} width="100%" height={12} />
				</div>
			</CardHeader>

			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-2">
					<Skeleton
						width={60}
						height={24}
						className="rounded-full"
					/>
					<Skeleton
						width={60}
						height={24}
						className="rounded-full"
					/>
				</div>
			</CardContent>
		</Card>
	);
}

export default ProjectCardSkeleton;
