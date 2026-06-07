"use client";

import { AuthForm } from "@/components/forms/auth-form";
import { useSignup } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

export default function AdminSignupPage() {
	const router = useRouter();
	const mutation = useSignup();

	const handleSubmit = async (data: {
		name?: string;
		username: string;
		password: string;
	}) => {
		await mutation.mutateAsync(
			data as {
				name: string;
				username: string;
				password: string;
			},
		);
		router.push("/admin/login");
	};

	return (
		<div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
			<AuthForm
				mode="signup"
				onSubmit={handleSubmit}
				isPending={mutation.isPending}
				error={mutation.isError ? mutation.error.message : null}
			/>
		</div>
	);
}
