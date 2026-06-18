import type { PagesProps } from "@/types";

export default function AdminLayout({ children }: PagesProps) {
	return <div className="min-w-0">{children}</div>;
}
