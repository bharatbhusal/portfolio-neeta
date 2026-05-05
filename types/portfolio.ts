export type NavigationLink = {
	label: string;
	href: string;
};

export type SocialLink = {
	label: string;
	href: string;
};

export type ActionLink = {
	label: string;
	href: string;
	variant: "default" | "outline";
};

export type SectionStat = {
	label: string;
	value: string;
};

export type SiteData = {
	name: string;
	role: string;
	tagline: string;
	description: string;
	location: string;
	email: string;
	phone: string;
	seo: {
		title: string;
		description: string;
		url: string;
		ogImage: string;
	};
	nav: NavigationLink[];
	social: SocialLink[];
	hero: {
		eyebrow: string;
		title: string;
		summary: string;
		accent: string;
		image: string;
		actions: ActionLink[];
	};
	about: {
		bio: string;
		vision: string;
		mission: string;
		values: string[];
		stats: SectionStat[];
	};
};

export type Project = {
	key: string;
	title: string;
	category: string;
	summary: string;
	description: string;
	year: string;
	featured: boolean;
	tags: string[];
};

export type ProjectsData = {
	projects: Project[];
};

export type ContactData = {
	heading: string;
	summary: string;
	availability: string;
	email: string;
	phone: string;
	location: string;
	vcard: {
		filename: string;
	};
	channels: SocialLink[];
};
