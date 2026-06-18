"use client";

import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import {
	apiRequest,
	ApiClientError,
} from "@/lib/apiClient";
import type {
	AuthStatus,
	AuthUser,
	LoginPayload,
	SignupPayload,
} from "@/types/auth";
import type { UploadSignaturePayload } from "@/types/upload";
import type {
	ProjectInput,
	ProjectUpdate,
	ProjectRequestInput,
} from "@/lib/validators";
import type { Project, ProjectRequest } from "@/types/portfolio";

export function useLogin() {
	return useMutation<AuthUser, ApiClientError, LoginPayload>(
		{
			mutationFn: (payload) =>
				apiRequest<AuthUser>("/auth/login", {
					method: "POST",
					body: payload,
				}),
		},
	);
}

export function useSignup() {
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
	});
}

export function useLogout() {
	return useMutation<
		{ message: string },
		ApiClientError,
		void
	>({
		mutationFn: () =>
			apiRequest<{ message: string }>("/auth/logout", {
				method: "POST",
			}),
	});
}

export function useIsAuthenticated() {
	return useQuery<AuthStatus, ApiClientError>({
		queryKey: ["auth", "status"],
		queryFn: () => apiRequest<AuthStatus>("/auth/status"),
		staleTime: 5 * 60 * 1000,
		retry: false,
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

export function useCreateProject() {
	const qc = useQueryClient();
	return useMutation<Project, ApiClientError, ProjectInput>({
		mutationFn: (payload) =>
			apiRequest<Project>("/projects", {
				method: "POST",
				body: payload,
			}),
		onSuccess: async () => {
			await qc.invalidateQueries({
				queryKey: ["projects"],
				refetchType: "all",
			});
		},
	});
}

export function useCreateProjectRequest() {
	return useMutation<
		ProjectRequest,
		ApiClientError,
		ProjectRequestInput
	>({
		mutationFn: (payload) =>
			apiRequest<ProjectRequest>("/requests", {
				method: "POST",
				body: payload,
			}),
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
				await qc.invalidateQueries({
					queryKey: ["projects"],
					refetchType: "all",
				});
			},
		},
	);
}
