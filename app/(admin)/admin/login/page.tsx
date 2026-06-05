"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isPending, startTransition] = useTransition();

	function handleSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();
		setError(null);
		startTransition(async () => {
			const result = await loginAction({ username, password });
			if (result.error) {
				setError(result.error);
				return;
			}

			router.refresh();
			router.back();
		});
	}

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

					{error && (
						<p className="text-sm text-destructive">{error}</p>
					)}

					<Button type="submit" disabled={isPending}>
						{isPending ? "Signing in..." : "Sign in"}
					</Button>
				</form>
			</div>
		</main>
	);
}
