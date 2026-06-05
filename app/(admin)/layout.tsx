import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSiteData } from "@/lib/data";
import { getAuthenticatedUserOrNull } from "@/services/auth";

export default async function AdminLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [site, user] = await Promise.all([
		getSiteData(),
		getAuthenticatedUserOrNull(),
	]);

	return (
		<div className="flex min-h-dvh flex-col">
			<Navbar site={site} />
			<div className="flex-1">{children}</div>
			<Footer site={site} isAuthenticated={Boolean(user)} />
		</div>
	);
}
