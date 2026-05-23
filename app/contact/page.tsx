import { Contact } from "@/components/sections/contact";
import { buildPageMetadata } from "@/lib/seo";
import { fetchJson, fetchJsonNoStore } from "@/lib/data";
import type {
	ClientProjectsResponse,
	ContactData,
	FeaturedProjectResponse,
	SiteData,
} from "@/types/portfolio";

export async function generateMetadata() {
	const site = await fetchJson<SiteData>("/api/site");

	return buildPageMetadata(site, {
		title: "Contact | Neeta Bhusal",
		description:
			"Reach out for portfolio projects, collaborations, and creative partnerships.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const [contact, clientProjects, featuredProject] =
		await Promise.all([
			fetchJson<ContactData>("/api/contact"),
			fetchJsonNoStore<ClientProjectsResponse>(
				"/api/client-projects?count=4",
			),
			fetchJsonNoStore<FeaturedProjectResponse>(
				"/api/featured-project",
			),
		]);

	return (
		<main className="pb-8 lg:pb-12">
			<Contact
				contact={contact}
				clientProjects={clientProjects.projects}
				featuredProject={featuredProject.project}
			/>
		</main>
	);
}
