"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignup } from "@/hooks/useApi";

export default function AdminSignupPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const nextPath = "/admin/projects/new";

	const mutation = useSignup();

	return (
		<main className="mx-auto flex min-h-[70vh] w-full max-w-lg items-center px-4 py-12 sm:px-6">
			<div className="w-full space-y-6 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm">
				<div className="space-y-2">
					<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
						Admin
					</p>
					<h1 className="text-2xl font-semibold tracking-tight">
						Create account
					</h1>
					<p className="text-sm text-muted-foreground">
						Set up a new admin account to manage projects.
					</p>
				</div>

				<form
					className="space-y-5"
					onSubmit={(event) => {
						event.preventDefault();

						if (password !== confirmPassword) {
							mutation.reset();
							mutation
								.mutateAsync({ username, password } as any)
								.catch(() => {});
							return;
						}

						mutation
							.mutateAsync({ username, password } as any)
							.then(() => {
								router.push(nextPath);
							})
							.catch(() => {});
					}}
				>
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
							autoComplete="new-password"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="confirmPassword">
							Confirm password
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(event) =>
								setConfirmPassword(event.target.value)
							}
							required
							autoComplete="new-password"
						/>
					</div>

					{mutation.isError && (
						<p className="text-sm text-destructive">
							{mutation.error instanceof Error
								? mutation.error.message
								: "Unable to create account. Please try again."}
						</p>
					)}

					<Button type="submit" disabled={mutation.isPending}>
						{mutation.isPending
							? "Creating account..."
							: "Create account"}
					</Button>
				</form>

				<p className="text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						className="font-medium text-foreground underline-offset-4 hover:underline"
						href="/admin/login"
					>
						Sign in
					</Link>
				</p>
			</div>
		</main>
	);
}
