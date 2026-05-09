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
	summary?: string;
	story?: string;
	description: string;
	year: string;
	featured: boolean;
	tags: string[];
	client?: string;
	link?: string;
	imageUrl?: string;
	downloadUrl?: string;
};

export type ProjectsData = {
	projects: Project[];
};

export type ContactData = {
	heading: string;
	summary: string;
	vcard: {
		filename: string;
	};
	channels: SocialLink[];
};

export type AboutMeData = {
	title: string;
	bio: string;
	long: string;
	cta: ActionLink;
};

export type PaginatedProjectsData = {
	projects: Project[];
	categories: string[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};
