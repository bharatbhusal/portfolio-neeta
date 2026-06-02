"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/useApi";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const mutation = useLogin();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleSubmit = (event: any) => {
		event.preventDefault();
		mutation
			.mutateAsync({ username, password })
			.then(() => {
				router.back();
			})
			.catch(() => {});
	};

	return (
		<main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4 py-12 sm:px-6">
			<div className="w-full space-y-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Admin
					</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						Sign in
					</h1>
					<p className="text-sm text-muted-foreground">
						Use your admin credentials to manage projects.
					</p>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="username">Username</Label>
						<Input
							id="username"
							value={username}
							onChange={(event) => setUsername(event.target.value)}
							required
							autoComplete="username"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
							autoComplete="current-password"
						/>
					</div>

					{mutation.isError && (
						<p className="text-sm text-destructive">
							Invalid credentials. Please try again.
						</p>
					)}

					<Button type="submit" disabled={mutation.isPending}>
						{mutation.isPending ? "Signing in..." : "Sign in"}
					</Button>
				</form>
			</div>
		</main>
	);
}
