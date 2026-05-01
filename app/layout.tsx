import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { fetchJson } from "@/lib/data";
import type {
	ContactData,
	SiteData,
} from "@/types/portfolio";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: site.seo.title,
		description: site.seo.description,
		path: "/",
		image: site.seo.ogImage,
	});
}

export const dynamic = "force-dynamic";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [site, contact] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<ContactData>("/data/contact.json"),
	]);

	return (
		<html
			lang="en"
			data-scroll-behavior="smooth"
			suppressHydrationWarning
			className="h-full antialiased"
		>
			<body
				className={`${geistSans.variable} ${geistMono.variable} min-h-dvh bg-background text-foreground`}
			>
				<ThemeProvider>
					<div className="flex min-h-dvh flex-col">
						<Navbar site={site} />
						<div className="flex-1">{children}</div>
						<Footer site={site} contact={contact} />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
