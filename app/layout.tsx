import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { QueryProvider } from "@/components/providers/query-provider";
import { getCachedSiteData } from "@/lib/data";
import { ZoomLock } from "./zoom-lock";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const site = await getCachedSiteData();

	return buildPageMetadata(site, {
		title: site.seo.title,
		description: site.seo.description,
		path: "/",
	});
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const site = await getCachedSiteData();

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
					<ZoomLock>
						<div className="flex min-h-dvh flex-col">
							<Navbar site={site} />
							<div className="mx-auto flex-1 w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
								{children}
							</div>
							<Footer site={site} />
						</div>
					</ZoomLock>
				</QueryProvider>
			</body>
		</html>
	);
}
