"use client";

import {
	useQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import {
	apiRequest,
	ApiClientError,
} from "@/lib/apiClient";
import type {
	AuthUser,
	LoginPayload,
	SignupPayload,
} from "@/types/auth";
import type { UploadSignaturePayload } from "@/types/upload";
import type {
	ProjectInput,
	ProjectUpdate,
} from "@/lib/validators";
import type {
	PaginatedProjectsData,
	Project,
} from "@/types/portfolio";

async function refetchProjectRelatedQueries(
	qc: ReturnType<typeof useQueryClient>,
	id?: string,
) {
	const tasks = [
		qc.invalidateQueries({
			queryKey: ["projects"],
			refetchType: "all",
		}),
		qc.invalidateQueries({
			queryKey: ["featured-projects"],
			refetchType: "all",
		}),
		qc.invalidateQueries({
			queryKey: ["client-projects"],
			refetchType: "all",
		}),
		qc.invalidateQueries({
			queryKey: ["categories"],
			refetchType: "all",
		}),
	];

	if (id) {
		tasks.push(
			qc.invalidateQueries({
				queryKey: ["project", id],
				refetchType: "all",
			}),
		);
	}

	await Promise.all(tasks);
}

export function useAuthMe(options?: { enabled?: boolean }) {
	return useQuery<AuthUser, ApiClientError>({
		queryKey: ["auth", "me"],
		queryFn: () => apiRequest<AuthUser>("/auth/me"),
		enabled: options?.enabled ?? true,
		retry: 1,
	});
}

export function useLogin() {
	const qc = useQueryClient();
	return useMutation<AuthUser, ApiClientError, LoginPayload>(
		{
			mutationFn: (payload) =>
				apiRequest<AuthUser>("/auth/login", {
					method: "POST",
					body: payload,
				}),
			onSuccess: () =>
				qc.invalidateQueries({ queryKey: ["auth", "me"] }),
		},
	);
}

export function useSignup() {
	const qc = useQueryClient();
	return useMutation<
		AuthUser,
		ApiClientError,
		SignupPayload
	>({
		mutationFn: (payload) =>
			apiRequest<AuthUser>("/auth/signup", {
				method: "POST",
				body: payload,
			}),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["auth", "me"] }),
	});
}

export function useLogout() {
	const qc = useQueryClient();
	return useMutation<
		{ message: string },
		ApiClientError,
		void
	>({
		mutationFn: () =>
			apiRequest<{ message: string }>("/auth/logout", {
				method: "POST",
			}),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["auth", "me"] }),
	});
}

export function useGetSignature(publicId: string) {
	return useQuery<UploadSignaturePayload, ApiClientError>({
		queryKey: ["uploads", "signature", publicId],
		queryFn: () =>
			apiRequest<UploadSignaturePayload>(
				`/images/signature?publicId=${encodeURIComponent(publicId)}`,
			),
		enabled: Boolean(publicId),
		retry: 1,
	});
}

export function useProjects(params: {
	page: number;
	pageSize?: number;
	category?: string;
	q?: string;
},
options?: {
	initialData?: PaginatedProjectsData;
}) {
	const { page, pageSize = 10, category, q } = params;
	const qs = new URLSearchParams();
	qs.set("page", String(page));
	qs.set("pageSize", String(pageSize));
	if (category && category !== "All")
		qs.set("category", category);
	if (q) qs.set("q", q);

	return useQuery<PaginatedProjectsData, ApiClientError>({
		queryKey: ["projects", qs.toString()],
		queryFn: () =>
			apiRequest<PaginatedProjectsData>(
				`/projects?${qs.toString()}`,
			),
		initialData: options?.initialData,
		refetchOnMount: options?.initialData
			? false
			: undefined,
		retry: 1,
	});
}

export function useProject(
	id: string,
	options?: {
		enabled?: boolean;
		initialData?: Project;
	},
) {
	return useQuery<Project, ApiClientError>({
		queryKey: ["project", id],
		queryFn: () => apiRequest<Project>(`/projects/${id}`),
		enabled: (options?.enabled ?? true) && Boolean(id),
		initialData: options?.initialData,
		retry: 1,
	});
}

export function useCreateProject() {
	const qc = useQueryClient();
	return useMutation<Project, ApiClientError, ProjectInput>({
		mutationFn: (payload) =>
			apiRequest<Project>("/projects", {
				method: "POST",
				body: payload,
			}),
		onSuccess: async () => {
			await refetchProjectRelatedQueries(qc);
		},
	});
}

export function useUpdateProject(id: string) {
	const qc = useQueryClient();
	return useMutation<Project, ApiClientError, ProjectUpdate>(
		{
			mutationFn: (payload) =>
				apiRequest<Project>(
					`/projects/${encodeURIComponent(id)}`,
					{
						method: "PATCH",
						body: payload,
					},
				),
			onSuccess: async () => {
				await refetchProjectRelatedQueries(qc, id);
			},
		},
	);
}

export function useFeaturedProjects(count?: number) {
	const key = count
		? ["featured-projects", String(count)]
		: ["featured-projects", "all"];
	const query = count
		? `/projects/featured-projects?count=${String(count)}`
		: `/projects/featured-projects`;
	return useQuery<Project[], ApiClientError>({
		queryKey: key,
		queryFn: () => apiRequest<Project[]>(query),
		retry: 1,
	});
}

export function useClientProjects(count?: number) {
	const key = count
		? ["client-projects", String(count)]
		: ["client-projects", "all"];
	const q = count
		? `/projects/client-projects?count=${String(count)}`
		: `/projects/client-projects`;
	return useQuery<Project[], ApiClientError>({
		queryKey: key,
		queryFn: () => apiRequest<Project[]>(q),
		retry: 1,
	});
}

export function useCategories(options?: {
	initialData?: string[];
}) {
	return useQuery<string[], ApiClientError>({
		queryKey: ["categories"],
		queryFn: () => apiRequest<string[]>(`/categories`),
		initialData: options?.initialData,
		refetchOnMount: options?.initialData
			? false
			: undefined,
		retry: 1,
	});
}
