import { z } from "zod";

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

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProjectInput = z.infer<
	typeof ProjectInputSchema
>;
export type ProjectUpdate = z.infer<
	typeof ProjectUpdateSchema
>;
