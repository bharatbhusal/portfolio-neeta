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
	PaginatedProjectsData,
	Project,
	ProjectResponse,
	SiteData,
	ContactData,
	FeaturedProjectsResponse,
	FeaturedProjectResponse,
	ClientProjectsResponse,
} from "@/types/portfolio";

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

export function useGetSignature(publicId?: string) {
	return useQuery<UploadSignaturePayload, ApiClientError>({
		queryKey: ["uploads", "signature", publicId ?? ""],
		queryFn: () =>
			apiRequest<UploadSignaturePayload>(
				`/images/signature?publicId=${encodeURIComponent(publicId ?? "")}`,
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
		retry: 1,
	});
}

export function useProject(key: string | undefined) {
	return useQuery<ProjectResponse, ApiClientError>({
		queryKey: ["project", key ?? ""],
		queryFn: () =>
			apiRequest<ProjectResponse>(
				`/project?key=${encodeURIComponent(key ?? "")}`,
			),
		enabled: Boolean(key),
		retry: 1,
	});
}

export function useCreateProject() {
	const qc = useQueryClient();
	return useMutation<void, ApiClientError, Project>({
		mutationFn: (payload) =>
			apiRequest<void>("/projects", {
				method: "POST",
				body: payload,
			}),
		onSuccess: () =>
			qc.invalidateQueries({ queryKey: ["projects"] }),
	});
}

export function useUpdateProject(key: string) {
	const qc = useQueryClient();
	return useMutation<void, ApiClientError, Project>({
		mutationFn: (payload) =>
			apiRequest<void>(
				`/project?key=${encodeURIComponent(key)}`,
				{
					method: "PUT",
					body: payload,
				},
			),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["projects"] });
			qc.invalidateQueries({ queryKey: ["project", key] });
		},
	});
}

export function useSite() {
	return useQuery<SiteData, ApiClientError>({
		queryKey: ["site"],
		queryFn: () => apiRequest<SiteData>("/site"),
		retry: 1,
	});
}

export function useContact() {
	return useQuery<ContactData, ApiClientError>({
		queryKey: ["contact"],
		queryFn: () => apiRequest<ContactData>("/contact"),
		retry: 1,
	});
}

export function useFeaturedProjects(count?: number) {
	const key = count
		? ["featured-projects", String(count)]
		: ["featured-projects", "all"];
	const query = count
		? `/featured-projects?count=${encodeURIComponent(String(count))}`
		: `/featured-projects`;
	return useQuery<FeaturedProjectsResponse, ApiClientError>({
		queryKey: key,
		queryFn: () =>
			apiRequest<FeaturedProjectsResponse>(query),
		retry: 1,
	});
}

export function useFeaturedProject() {
	return useQuery<FeaturedProjectResponse, ApiClientError>({
		queryKey: ["featured-project"],
		queryFn: () =>
			apiRequest<FeaturedProjectResponse>("/featured-project"),
		retry: 1,
	});
}

export function useClientProjects(count?: number) {
	const q = count
		? `/client-projects?count=${encodeURIComponent(String(count))}`
		: `/client-projects`;
	return useQuery<ClientProjectsResponse, ApiClientError>({
		queryKey: ["client-projects", count ?? "all"],
		queryFn: () => apiRequest<ClientProjectsResponse>(q),
		retry: 1,
	});
}
