import { Hero } from "@/components/sections/hero";
import { getSiteData } from "@/lib/data";
import { buildCloudinaryImageUrl } from "@/services/image";

export default async function HomePage() {
	const site = await getSiteData();

	return (
		<main className="space-y-6 pb-8 lg:space-y-10">
			<Hero
				site={site}
				heroImageUrl={buildCloudinaryImageUrl(
					site.hero.image,
					{
						width: 1000,
						height: 1200,
						crop: "fill",
					},
				)}
			/>
		</main>
	);
}
