import { Contact } from "@/components/sections/contact";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson } from "@/lib/data";
import type {
	ContactData,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/data/site.json");

	return buildPageMetadata(site, {
		title: "Contact | Neeta Bhusal",
		description:
			"Reach out for portfolio projects, collaborations, and creative partnerships.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const [site, contact] = await Promise.all([
		fetchJson<SiteData>("/data/site.json"),
		fetchJson<ContactData>("/data/contact.json"),
	]);

	return (
		<main className="pb-8 lg:pb-12">
			<Contact site={site} contact={contact} />
		</main>
	);
}
