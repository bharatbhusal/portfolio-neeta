import { ProjectRequestForm } from "@/components/forms/project-request-form";
import { getCachedSiteData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata() {
	const site = await getCachedSiteData();

	return buildPageMetadata(site, {
		title: "Request a Logo Design | Neeta Bhusal",
		description:
			"Tell me about your brand and vision. I'll design a logo that captures your identity.",
		path: "/request/logo",
	});
}

export default function LogoRequestPage() {
	return <ProjectRequestForm />;
}
