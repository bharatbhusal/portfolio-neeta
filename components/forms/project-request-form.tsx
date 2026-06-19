"use client";

import {
	useState,
	useEffect,
	useCallback,
	useRef,
} from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ThankYouCard } from "@/components/cards/thank-you-card";
import { useCreateProjectRequest } from "@/hooks/useApi";
import {
	getPersistedValues,
	persistValues,
	clearPersistedValues,
} from "@/hooks/useFormPersistence";
import type { ProjectRequestInput } from "@/lib/validators";
import {
	LOGO_TYPES,
	BRAND_KEYWORDS,
	LOGO_FEELINGS,
	USAGE_OPTIONS,
	FILE_FORMATS,
} from "@/lib/constants";

type FormFields = {
	name: string;
	email: string;
	phone: string;
	brandName: string;
	businessDescription: string;
	targetAudience: string;
	brandKeywords: string[];
	logoFeeling: string[];
	logoType: string;
	colors: string;
	symbols: string;
	inspiration: string;
	usage: string[];
	fileFormats: string[];
	additionalNotes: string;
};

const defaultValues: FormFields = {
	name: "",
	email: "",
	phone: "",
	brandName: "",
	businessDescription: "",
	targetAudience: "",
	brandKeywords: [],
	logoFeeling: [],
	logoType: "",
	colors: "",
	symbols: "",
	inspiration: "",
	usage: [],
	fileFormats: [],
	additionalNotes: "",
};

function toggleArrayItem(
	arr: string[],
	item: string,
): string[] {
	return arr.includes(item)
		? arr.filter((i) => i !== item)
		: [...arr, item];
}

export function ProjectRequestForm() {
	const [fields, setFields] =
		useState<FormFields>(defaultValues);
	const persistTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);
	const mutation = useCreateProjectRequest();
	const [submitted, setSubmitted] = useState(false);

	useEffect(() => {
		const persisted =
			getPersistedValues<FormFields>(defaultValues);
		const hasData = Object.values(persisted).some(
			(v) =>
				(typeof v === "string" && v.length > 0) ||
				(Array.isArray(v) && v.length > 0),
		);
		if (hasData) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setFields(persisted);
		}
	}, []);

	const updateField = useCallback(
		<K extends keyof FormFields>(
			key: K,
			value: FormFields[K],
		) => {
			setFields((prev) => {
				const next = { ...prev, [key]: value };
				if (persistTimeoutRef.current) {
					clearTimeout(persistTimeoutRef.current);
				}
				persistTimeoutRef.current = setTimeout(
					() => persistValues(next),
					500,
				);
				return next;
			});
		},
		[],
	);

	const toggleField = useCallback(
		(
			key:
				| "brandKeywords"
				| "logoFeeling"
				| "usage"
				| "fileFormats",
			value: string,
		) => {
			setFields((prev) => {
				const next = {
					...prev,
					[key]: toggleArrayItem(prev[key], value),
				};
				if (persistTimeoutRef.current) {
					clearTimeout(persistTimeoutRef.current);
				}
				persistTimeoutRef.current = setTimeout(
					() => persistValues(next),
					500,
				);
				return next;
			});
		},
		[],
	);

	function buildPayload(): Record<string, unknown> {
		return {
			requestType: "logo_design",
			name: fields.name.trim(),
			email: fields.email.trim(),
			phone: fields.phone.trim() || undefined,
			brandName: fields.brandName.trim(),
			businessDescription:
				fields.businessDescription.trim() || undefined,
			targetAudience:
				fields.targetAudience.trim() || undefined,
			brandKeywords:
				fields.brandKeywords.length > 0
					? fields.brandKeywords
					: undefined,
			logoFeeling:
				fields.logoFeeling.length > 0
					? fields.logoFeeling
					: undefined,
			logoType: fields.logoType || undefined,
			colors: fields.colors.trim() || undefined,
			symbols: fields.symbols.trim() || undefined,
			inspiration: fields.inspiration.trim() || undefined,
			usage:
				fields.usage.length > 0 ? fields.usage : undefined,
			fileFormats:
				fields.fileFormats.length > 0
					? fields.fileFormats
					: undefined,
			additionalNotes:
				fields.additionalNotes.trim() || undefined,
		};
	}

	async function handleSubmit(
		event: React.FormEvent<HTMLFormElement>,
	) {
		event.preventDefault();
		if (
			!fields.name.trim() ||
			!fields.email.trim() ||
			!fields.brandName.trim()
		) {
			return;
		}
		try {
			await mutation.mutateAsync(
				buildPayload() as ProjectRequestInput,
			);
			clearPersistedValues();
			setSubmitted(true);
		} catch {
			// Error handled by mutation state
		}
	}

	if (submitted) {
		return <ThankYouCard />;
	}

	const isSubmitting = mutation.isPending;

	return (
		<div className="grid gap-6">
			<form
				className="space-y-8 rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm"
				onSubmit={handleSubmit}
			>
				<fieldset className="space-y-4">
					<legend className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						Contact Information
					</legend>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="name">
								Your Name{" "}
								<span className="text-destructive">*</span>
							</Label>
							<Input
								id="name"
								value={fields.name}
								onChange={(e) =>
									updateField("name", e.target.value)
								}
								required
								placeholder="e.g. Jane Doe"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">
								Email <span className="text-destructive">*</span>
							</Label>
							<Input
								id="email"
								type="email"
								value={fields.email}
								onChange={(e) =>
									updateField("email", e.target.value)
								}
								required
								placeholder="you@example.com"
							/>
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="phone">Phone / WhatsApp</Label>
						<Input
							id="phone"
							type="tel"
							value={fields.phone}
							onChange={(e) =>
								updateField("phone", e.target.value)
							}
							placeholder="+91 98765 43210"
						/>
					</div>
				</fieldset>

				<fieldset className="space-y-4">
					<legend className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						About Your Brand
					</legend>
					<div className="space-y-2">
						<Label htmlFor="brandName">
							Brand / Company Name{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							id="brandName"
							value={fields.brandName}
							onChange={(e) =>
								updateField("brandName", e.target.value)
							}
							required
							placeholder="Your brand or business name"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="businessDescription">
							What does your business do?
						</Label>
						<Textarea
							id="businessDescription"
							value={fields.businessDescription}
							onChange={(e) =>
								updateField("businessDescription", e.target.value)
							}
							placeholder="Describe your business, products, or services..."
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="targetAudience">
							Who is your target audience?
						</Label>
						<Textarea
							id="targetAudience"
							value={fields.targetAudience}
							onChange={(e) =>
								updateField("targetAudience", e.target.value)
							}
							placeholder="Describe your ideal customers or audience..."
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label>
							Describe your brand in 3&ndash;5 keywords
						</Label>
						<div className="flex flex-wrap gap-3">
							{BRAND_KEYWORDS.map((kw) => (
								<label
									key={kw}
									className="flex items-center gap-2 text-sm cursor-pointer"
								>
									<Checkbox
										checked={fields.brandKeywords.includes(kw)}
										onCheckedChange={() =>
											toggleField("brandKeywords", kw)
										}
									/>
									{kw}
								</label>
							))}
						</div>
					</div>
				</fieldset>

				<fieldset className="space-y-4">
					<legend className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						Design Direction
					</legend>
					<div className="space-y-2">
						<Label>What feeling should your logo give?</Label>
						<div className="flex flex-wrap gap-3">
							{LOGO_FEELINGS.map((feeling) => (
								<label
									key={feeling}
									className="flex items-center gap-2 text-sm cursor-pointer"
								>
									<Checkbox
										checked={fields.logoFeeling.includes(feeling)}
										onCheckedChange={() =>
											toggleField("logoFeeling", feeling)
										}
									/>
									{feeling}
								</label>
							))}
						</div>
					</div>
					<div className="space-y-2">
						<Label>What type of logo do you want?</Label>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="w-full sm:w-auto"
								>
									{fields.logoType
										? LOGO_TYPES.find(
												(t) => t.value === fields.logoType,
											)?.label
										: "Select logo type"}
									<ChevronDownIcon className="ml-1 size-3.5" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56">
								<DropdownMenuRadioGroup
									value={fields.logoType}
									onValueChange={(v) => updateField("logoType", v)}
								>
									{LOGO_TYPES.map((type) => (
										<DropdownMenuRadioItem
											key={type.value}
											value={type.value}
										>
											{type.label}
										</DropdownMenuRadioItem>
									))}
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="space-y-2">
						<Label htmlFor="colors">
							Any preferred colors or colors to avoid?
						</Label>
						<Textarea
							id="colors"
							value={fields.colors}
							onChange={(e) =>
								updateField("colors", e.target.value)
							}
							placeholder="e.g. I love deep blues and golds. Please avoid neon colors."
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="symbols">
							Any symbols/icons you want included or avoided?
						</Label>
						<Textarea
							id="symbols"
							value={fields.symbols}
							onChange={(e) =>
								updateField("symbols", e.target.value)
							}
							placeholder="e.g. I'd like a mountain icon. Please avoid generic globes."
							className="min-h-[80px]"
						/>
					</div>
				</fieldset>

				<fieldset className="space-y-4">
					<legend className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						References &amp; Usage
					</legend>
					<div className="space-y-2">
						<Label htmlFor="inspiration">
							Share 2&ndash;3 logos or brands you like
						</Label>
						<Textarea
							id="inspiration"
							value={fields.inspiration}
							onChange={(e) =>
								updateField("inspiration", e.target.value)
							}
							placeholder="Links or descriptions of logos/brands that inspire you..."
							className="min-h-[80px]"
						/>
					</div>
					<div className="space-y-2">
						<Label>Where will the logo mainly be used?</Label>
						<div className="flex flex-wrap gap-3">
							{USAGE_OPTIONS.map((opt) => (
								<label
									key={opt}
									className="flex items-center gap-2 text-sm cursor-pointer"
								>
									<Checkbox
										checked={fields.usage.includes(opt)}
										onCheckedChange={() => toggleField("usage", opt)}
									/>
									{opt}
								</label>
							))}
						</div>
					</div>
					<div className="space-y-2">
						<Label>What files do you need?</Label>
						<div className="flex flex-wrap gap-3">
							{FILE_FORMATS.map((fmt) => (
								<label
									key={fmt}
									className="flex items-center gap-2 text-sm cursor-pointer"
								>
									<Checkbox
										checked={fields.fileFormats.includes(fmt)}
										onCheckedChange={() =>
											toggleField("fileFormats", fmt)
										}
									/>
									{fmt}
								</label>
							))}
						</div>
					</div>
				</fieldset>

				<fieldset className="space-y-4">
					<legend className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
						Additional
					</legend>
					<div className="space-y-2">
						<Label htmlFor="additionalNotes">
							Any additional ideas or vision for the logo?
						</Label>
						<Textarea
							id="additionalNotes"
							value={fields.additionalNotes}
							onChange={(e) =>
								updateField("additionalNotes", e.target.value)
							}
							placeholder="Anything else you'd like me to know..."
							className="min-h-[80px]"
						/>
					</div>
				</fieldset>

				{mutation.isError && (
					<p className="text-sm text-destructive">
						{mutation.error.message}
					</p>
				)}

				<div className="flex flex-wrap gap-3">
					<Button
						type="submit"
						disabled={
							isSubmitting ||
							!fields.name.trim() ||
							!fields.email.trim() ||
							!fields.brandName.trim()
						}
					>
						{isSubmitting ? "Submitting..." : "Submit Request"}
					</Button>
				</div>
			</form>
		</div>
	);
}
