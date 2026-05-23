import type { Metadata } from "next";

import type { SiteData } from "@/types/portfolio";

type PageMetadataOptions = {
	title: string;
	description: string;
	path: string;
	image?: string;
};

export function buildPageMetadata(
	site: SiteData,
	options: PageMetadataOptions,
): Metadata {
	const url = new URL(site.seo.url);
	const pageUrl = new URL(options.path, url);
	const image = options.image ?? site.seo.ogImage;

	return {
		metadataBase: url,
		title: options.title,
		description: options.description,
		alternates: {
			canonical: pageUrl.pathname,
		},
		openGraph: {
			title: options.title,
			description: options.description,
			url: pageUrl,
			siteName: site.name,
			type: "website",
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: options.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: options.title,
			description: options.description,
			images: [image],
		},
		icons: {
			icon: [{ url: image, type: "image/jpeg" }],
			apple: [{ url: image, type: "image/jpeg" }],
			shortcut: [{ url: image, type: "image/jpeg" }],
		},
	};
}
