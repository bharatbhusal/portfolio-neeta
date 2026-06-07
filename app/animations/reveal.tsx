import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
	children: ReactNode;
	className?: string;
};

export function Reveal({
	children,
	className,
}: RevealProps) {
	return (
		<div data-reveal className={cn(className)}>
			{children}
		</div>
	);
}
