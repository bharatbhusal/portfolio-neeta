export type NavigationLink = {
	label: string;
	href: string;
};

export type SocialLink = {
	label: string;
	href: string;
	icon: string;
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
		stats: SectionStat[];
		bio: string;
	};
};

export type Project = {
	_id: string;
	key: string;
	title: string;
	category: string;
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

export type PaginatedProjectsData = {
	projects: Project[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};

export type ProjectRequest = {
	_id: string;
	requestType: "logo_design";
	name: string;
	email: string;
	phone?: string;
	status: "pending" | "reviewed" | "accepted" | "declined";
	notes?: string;

	brandName: string;
	businessDescription?: string;
	targetAudience?: string;
	brandKeywords?: string[];
	logoFeeling?: string[];
	logoType?:
		| "text_logo"
		| "icon_logo"
		| "combination_logo"
		| "mascot_logo"
		| "abstract_logo";
	colors?: string;
	symbols?: string;
	inspiration?: string;
	usage?: string[];
	fileFormats?: string[];
	additionalNotes?: string;
	createdAt: string;
	updatedAt: string;
};

export type PaginatedProjectRequestsData = {
	requests: ProjectRequest[];
	pagination: {
		page: number;
		pageSize: number;
		total: number;
		totalPages: number;
	};
};
