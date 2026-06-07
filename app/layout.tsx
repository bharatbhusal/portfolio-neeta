import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QueryProvider } from "@/components/providers/query-provider";
import { fetchJson } from "@/lib/data";
import { isAuthenticated } from "@/lib/server-auth";
import { SiteData } from "@/types/portfolio";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const site = await fetchJson<SiteData>("/site.json");

	return buildPageMetadata(site, {
		title: site.seo.title,
		description: site.seo.description,
		path: "/",
	});
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [site, authed] = await Promise.all([
		fetchJson<SiteData>("/site.json"),
		isAuthenticated(),
	]);

	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
			className="dark h-full antialiased"
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground`}
			>
				<QueryProvider>
					<div className="flex min-h-dvh flex-col">
						<Navbar site={site} />
						<div className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
							{children}
						</div>
						<Footer site={site} isAuthenticated={authed} />
					</div>
				</QueryProvider>
			</body>
		</html>
	);
}
