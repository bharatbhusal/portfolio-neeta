import { Contact } from "@/components/sections/contact";
import { getSiteData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import {
	getClientProjects,
	getFeaturedProjects,
} from "@/services/projects";

export async function generateMetadata() {
	const site = await getSiteData();

	return buildPageMetadata(site, {
		title: "Contact | Neeta Bhusal",
		description:
			"Reach out for portfolio projects, collaborations, and creative partnerships.",
		path: "/contact",
	});
}

export default async function ContactPage() {
	const [site, featuredProject, clientProjects] =
		await Promise.all([
			getSiteData(),
			getFeaturedProjects(1),
			getClientProjects(),
		]);

	return (
		<main className="pb-8 lg:pb-12">
			<Contact
				social={site.social}
				featuredProject={featuredProject[0]}
				clientProjects={clientProjects}
			/>
		</main>
	);
}
