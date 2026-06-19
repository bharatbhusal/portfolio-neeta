export const STATUS_VALUES = [
	"pending",
	"reviewed",
	"accepted",
	"declined",
] as const;

export const STATUS_LABELS: Record<string, string> = {
	all: "All",
	pending: "Pending",
	reviewed: "Reviewed",
	accepted: "Accepted",
	declined: "Declined",
};

export const STATUS_VARIANTS: Record<
	string,
	"default" | "secondary" | "outline" | "destructive"
> = {
	pending: "outline",
	reviewed: "secondary",
	accepted: "default",
	declined: "destructive",
};

export const STATUS_FILTERS = [
	{ label: "All", value: "all" },
	{ label: "Pending", value: "pending" },
	{ label: "Reviewed", value: "reviewed" },
	{ label: "Accepted", value: "accepted" },
	{ label: "Declined", value: "declined" },
];

export const LOGO_TYPE_VALUES = [
	"text_logo",
	"icon_logo",
	"combination_logo",
	"mascot_logo",
	"abstract_logo",
] as const;

export const LOGO_TYPE_LABELS: Record<string, string> = {
	text_logo: "Text Logo (Wordmark)",
	icon_logo: "Icon Logo (Symbol)",
	combination_logo: "Combination Logo",
	mascot_logo: "Mascot Logo",
	abstract_logo: "Abstract Logo",
};

export const LOGO_TYPE_SHORT_LABELS: Record<
	string,
	string
> = {
	text_logo: "Wordmark",
	icon_logo: "Icon Logo",
	combination_logo: "Combination",
	mascot_logo: "Mascot",
	abstract_logo: "Abstract",
};

export const LOGO_TYPES = [
	{ value: "text_logo", label: "Text Logo (Wordmark)" },
	{ value: "icon_logo", label: "Icon Logo (Symbol)" },
	{ value: "combination_logo", label: "Combination Logo" },
	{ value: "mascot_logo", label: "Mascot Logo" },
	{ value: "abstract_logo", label: "Abstract Logo" },
] as const;

export const BRAND_KEYWORDS = [
	"Modern",
	"Minimal",
	"Luxury",
	"Bold",
	"Friendly",
	"Creative",
	"Professional",
	"Premium",
	"Futuristic",
	"Elegant",
	"Playful",
	"Traditional",
	"Artistic",
	"Corporate",
] as const;

export const LOGO_FEELINGS = [
	"Trust",
	"Energy",
	"Luxury",
	"Fun",
	"Confidence",
	"Innovation",
	"Calm",
	"Creativity",
	"Strength",
	"Happiness",
] as const;

export const USAGE_OPTIONS = [
	"Instagram",
	"Website",
	"Packaging",
	"Business Card",
	"App",
	"Print",
	"YouTube",
	"Merchandise",
] as const;

export const FILE_FORMATS = [
	"PNG",
	"JPG",
	"SVG",
	"PDF",
	"AI File",
	"Transparent Background",
	"Black & White Version",
	"Social Media Kit",
] as const;
