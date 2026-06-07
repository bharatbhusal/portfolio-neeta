"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthFormProps = {
	mode: "login" | "signup";
	onSubmit: (data: {
		name?: string;
		username: string;
		password: string;
	}) => Promise<void>;
	isPending: boolean;
	error: string | null;
};

export function AuthForm({
	mode,
	onSubmit,
	isPending,
	error,
}: AuthFormProps) {
	const [name, setName] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const data =
			mode === "signup"
				? { name, username, password }
				: { username, password };
		onSubmit(data);
	};

	return (
		<div className="w-full space-y-6">
			<form className="space-y-5" onSubmit={handleSubmit}>
				{mode === "signup" && (
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							value={name}
							onChange={(event) => setName(event.target.value)}
							required
							autoComplete="name"
						/>
					</div>
				)}

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
						autoComplete={
							mode === "login"
								? "current-password"
								: "new-password"
						}
					/>
				</div>

				{error && (
					<p className="text-sm text-destructive">{error}</p>
				)}

				<Button type="submit" disabled={isPending}>
					{isPending
						? mode === "login"
							? "Signing in..."
							: "Creating account..."
						: mode === "login"
							? "Sign in"
							: "Create account"}
				</Button>
			</form>

			<p className="text-start text-sm text-muted-foreground">
				{mode === "login" ? (
					<>
						Don&apos;t have an account?{" "}
						<Link
							href="/admin/signup"
							className="text-primary underline underline-offset-4"
						>
							Sign up
						</Link>
					</>
				) : (
					<>
						Already have an account?{" "}
						<Link
							href="/admin/login"
							className="text-primary underline underline-offset-4"
						>
							Sign in
						</Link>
					</>
				)}
			</p>
		</div>
	);
}
