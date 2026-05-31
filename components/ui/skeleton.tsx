"use client";

import React from "react";

type SkeletonProps = {
	width?: string | number;
	height?: string | number;
	rows?: number;
	className?: string;
	variant?: "rect" | "rounded" | "circle";
	animated?: boolean;
};

export function Skeleton({
	width = "100%",
	height = 12,
	rows = 1,
	className = "",
	variant = "rounded",
	animated = true,
}: SkeletonProps) {
	const border =
		variant === "circle"
			? "rounded-full"
			: variant === "rect"
				? "rounded-none"
				: "rounded-md";
	const animation = animated ? "animate-pulse" : "";

	if (rows <= 1) {
		return (
			<div
				role="status"
				aria-busy="true"
				className={`${animation} ${className}`}
				style={{ width, height }}
			>
				<div
					className={`${border} bg-slate-200/60 dark:bg-slate-700/40 w-full h-full`}
				/>
			</div>
		);
	}

	return (
		<div
			className={`${animation} ${className}`}
			aria-busy="true"
		>
			{Array.from({ length: rows }).map((_, i) => (
				<div
					key={i}
					className={`${i === rows - 1 ? "mb-0" : "mb-2"} ${border} bg-slate-200/60 dark:bg-slate-700/40`}
					style={{
						width,
						height: typeof height === "number" ? height : height,
					}}
				/>
			))}
		</div>
	);
}

export default Skeleton;
