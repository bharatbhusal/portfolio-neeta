"use client";

import { SocialLink } from "@/types/portfolio";
import { Button } from "./ui/button";
import { iconMap } from "@/lib/iconMapper";

type SocialLinksProps = {
	socials: SocialLink[];
};

export function SocialLinks({ socials }: SocialLinksProps) {
	return (
		<>
			{socials.map((channel) => {
				const IconComponent = iconMap[channel.icon];
				return (
					<Button
						key={channel.label}
						onClick={() => window.open(channel.href, "_blank")}
						className="flex items-center gap-2 transition hover:bg-foreground/10"
						variant="outline"
					>
						<IconComponent className="w-4 h-4" />

						<span>{channel.label}</span>
					</Button>
				);
			})}
		</>
	);
}
