"use client";

import { useEffect } from "react";

export function ZoomLock({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (e.ctrlKey) {
				e.preventDefault();
			}
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (
				(e.ctrlKey || e.metaKey) &&
				["+", "-", "=", "_", "0"].includes(e.key)
			) {
				e.preventDefault();
			}
		};

		document.addEventListener("wheel", handleWheel, {
			passive: false,
		});
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("wheel", handleWheel);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return <>{children}</>;
}
