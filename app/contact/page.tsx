import { ContactContent } from "../../components/sections/contact";
import {
	getClientProjectsController,
	getFeaturedProjectsController,
} from "@/controllers/projects";
import { getCachedSiteData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
	const site = await getCachedSiteData();

	return buildPageMetadata(site, {
		title: "Contact | Neeta Bhusal",
		description:
			"Reach out for portfolio projects, collaborations, and creative partnerships.",
		path: "/contact",
	});
}

export const revalidate = 3600;

export default async function ContactPage() {
	const [site, featuredProjects, clientProjects] =
		await Promise.all([
			getCachedSiteData(),
			getFeaturedProjectsController(1),
			getClientProjectsController(3),
		]);

	return (
		<ContactContent
			social={site.social}
			featuredProject={featuredProjects?.[0] ?? null}
			clientProjects={clientProjects ?? []}
		/>
	);
}
