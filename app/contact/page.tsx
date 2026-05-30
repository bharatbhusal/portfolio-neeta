import { Contact } from "@/components/sections/contact";
import { fetchJson } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { SiteData } from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/site.json");

	return buildPageMetadata(site, {
		title: "Contact | Neeta Bhusal",
		description:
			"Reach out for portfolio projects, collaborations, and creative partnerships.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const site = await fetchJson<SiteData>("/site.json");

	return (
		<main className="pb-8 lg:pb-12">
			<Contact social={site.social} />
		</main>
	);
}
