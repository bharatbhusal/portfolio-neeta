import { z } from "zod";
import { STATUS_VALUES, LOGO_TYPE_VALUES, BRAND_KEYWORDS, LOGO_FEELINGS, USAGE_OPTIONS, FILE_FORMATS } from "./constants";

const optionalString = z.string().trim().optional();

export const ProjectInputSchema = z.object({
	key: z.string().min(1),
	title: z.string().min(1),
	category: z.string().optional(),
	story: optionalString,
	description: z.string().optional(),
	year: z.number().optional(),
	featured: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	client: optionalString,
	link: z.string().url().optional(),
});

export const ProjectUpdateSchema = z.object({
	key: z.string().min(1).optional(),
	title: z.string().min(1).optional(),
	category: z.string().min(1).optional(),
	story: optionalString,
	description: z.string().min(1).optional(),
	year: z.number().min(1).optional(),
	featured: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	client: optionalString,
	link: z.string().url().optional(),
});

export const AuthSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

export const signupSchema = z.object({
	username: z.string().min(5),
	password: z.string().min(8),
});

export const loginSchema = z.object({
	username: z.string().min(5),
	password: z.string().min(8),
});

const brandKeywordEnum = z.enum(BRAND_KEYWORDS);

const logoFeelingEnum = z.enum(LOGO_FEELINGS);

const usageEnum = z.enum(USAGE_OPTIONS);

const fileFormatEnum = z.enum(FILE_FORMATS);

export const ProjectRequestSchema = z.object({
	requestType: z
		.enum(["logo_design"])
		.default("logo_design"),
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Valid email is required"),
	phone: z.string().optional(),
	status: z
		.enum(STATUS_VALUES)
		.default("pending"),

	brandName: z
		.string()
		.min(1, "Brand/company name is required"),
	businessDescription: z.string().optional(),
	targetAudience: z.string().optional(),
	brandKeywords: z.array(brandKeywordEnum).optional(),
	logoFeeling: z.array(logoFeelingEnum).optional(),
	logoType: z
		.enum(LOGO_TYPE_VALUES)
		.optional(),
	colors: z.string().optional(),
	symbols: z.string().optional(),
	inspiration: z.string().optional(),
	usage: z.array(usageEnum).optional(),
	fileFormats: z.array(fileFormatEnum).optional(),
	additionalNotes: z.string().optional(),
});

export const ProjectRequestUpdateSchema = z.object({
	status: z.enum(STATUS_VALUES),
	notes: z.string().optional(),
});

export const ProjectRequestQuerySchema = z.object({
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().default(12),
	status: z
		.enum(STATUS_VALUES)
		.optional(),
	q: z.string().optional(),
	sortBy: z
		.enum([
			"createdAt",
			"name",
			"brandName",
			"status",
			"logoType",
		])
		.default("createdAt"),
	sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<
	typeof ProjectInputSchema
>;
export type ProjectUpdate = z.infer<
	typeof ProjectUpdateSchema
>;
export type ProjectRequestInput = z.infer<
	typeof ProjectRequestSchema
>;
export type ProjectRequestUpdate = z.infer<
	typeof ProjectRequestUpdateSchema
>;
export type ProjectRequestQuery = z.infer<
	typeof ProjectRequestQuerySchema
>;
