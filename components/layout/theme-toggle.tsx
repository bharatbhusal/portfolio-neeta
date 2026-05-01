"use client";

import React, { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const id =
			typeof window !== "undefined" &&
			(window.requestAnimationFrame
				? window.requestAnimationFrame(() => setMounted(true))
				: window.setTimeout(() => setMounted(true), 0));

		return () => {
			if (typeof id === "number") {
				if (window.cancelAnimationFrame) {
					window.cancelAnimationFrame(id as number);
				} else {
					clearTimeout(id as number);
				}
			}
		};
	}, []);

	const isDark = mounted
		? resolvedTheme === "dark"
		: undefined;

	return (
		<Button
			type="button"
			variant="outline"
			size="icon"
			aria-label="Toggle theme"
			onClick={() => setTheme(isDark ? "light" : "dark")}
			className="shrink-0 rounded-full border-border/70 bg-background/80 backdrop-blur"
		>
			{mounted ? (
				isDark ? (
					<SunMedium className="h-4 w-4" />
				) : (
					<MoonStar className="h-4 w-4" />
				)
			) : (
				<span className="h-4 w-4 block" />
			)}
		</Button>
	);
}
