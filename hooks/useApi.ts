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
	AuthUser,
	LoginPayload,
	SignupPayload,
} from "@/types/auth";
import type { UploadSignaturePayload } from "@/types/upload";
import type {
	ProjectInput,
	ProjectUpdate,
} from "@/lib/validators";
import type { Project } from "@/types/portfolio";

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

export function useCreateProject() {
	const qc = useQueryClient();
	return useMutation<Project, ApiClientError, ProjectInput>({
		mutationFn: (payload) =>
			apiRequest<Project>("/projects", {
				method: "POST",
				body: payload,
			}),
		onSuccess: async () => {
			await qc.invalidateQueries({ queryKey: ["projects"], refetchType: "all" });
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
				await qc.invalidateQueries({ queryKey: ["projects"], refetchType: "all" });
			},
		},
	);
}
