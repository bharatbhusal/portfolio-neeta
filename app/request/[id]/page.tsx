import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/server-auth";
import { getProjectRequestByIdController } from "@/controllers/projectRequests";
import { RequestStatusControl } from "@/components/sections/request-status-control";
import { LOGO_TYPE_LABELS } from "@/lib/constants";

type Props = {
	params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
	params,
}: Props): Promise<Metadata> {
	const { id } = await params;
	const request = await getProjectRequestByIdController(id);

	if (!request) {
		return { title: "Request not found" };
	}

	return {
		title: `Request: ${request.brandName} | Neeta Bhusal`,
		robots: { index: false, follow: false },
	};
}

export default async function PublicRequestPage({
	params,
}: Props) {
	const { id } = await params;
	const request = await getProjectRequestByIdController(id);

	if (!request) {
		notFound();
	}

	const [isAdmin] = await Promise.all([
		isAuthenticated().catch(() => false),
	]);

	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="space-y-2 text-center">
				<p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
					Request Status
				</p>
				<div className="flex items-center justify-center gap-3">
					<h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
						{request.brandName}
					</h2>
					<RequestStatusControl
						requestId={id}
						currentStatus={request.status}
						isAdmin={isAdmin}
					/>
				</div>
				<p className="text-muted-foreground text-sm">
					Submitted by {request.name} on{" "}
					{new Date(request.createdAt).toLocaleDateString(
						"en-IN",
						{
							day: "numeric",
							month: "long",
							year: "numeric",
						},
					)}
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Section title="Contact">
					<Field label="Name" value={request.name} />
					<Field label="Email" value={request.email} />
					<Field label="Phone" value={request.phone} />
				</Section>

				<Section title="Brand">
					<Field label="Brand Name" value={request.brandName} />
					<Field
						label="Description"
						value={request.businessDescription}
						multiline
					/>
					<Field
						label="Target Audience"
						value={request.targetAudience}
						multiline
					/>
					<Field
						label="Keywords"
						value={request.brandKeywords?.join(", ")}
					/>
				</Section>

				<Section title="Design Direction">
					<Field
						label="Desired Feeling"
						value={request.logoFeeling?.join(", ")}
					/>
					<Field
						label="Logo Type"
						value={
							request.logoType
								? LOGO_TYPE_LABELS[request.logoType]
								: undefined
						}
					/>
					<Field
						label="Preferred Colors"
						value={request.colors}
						multiline
					/>
					<Field
						label="Symbols / Icons"
						value={request.symbols}
						multiline
					/>
				</Section>

				<Section title="References &amp; Usage">
					<Field
						label="Inspiration"
						value={request.inspiration}
						multiline
					/>
					<Field
						label="Usage"
						value={request.usage?.join(", ")}
					/>
					<Field
						label="File Formats"
						value={request.fileFormats?.join(", ")}
					/>
				</Section>

				{request.additionalNotes && (
					<Section title="Additional Notes">
						<p className="text-sm whitespace-pre-wrap">
							{request.additionalNotes}
						</p>
					</Section>
				)}
			</div>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm space-y-3">
			<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
				{title}
			</h3>
			<div className="space-y-2">{children}</div>
		</div>
	);
}

function Field({
	label,
	value,
	multiline,
}: {
	label: string;
	value?: string | null;
	multiline?: boolean;
}) {
	if (!value) return null;

	const inner = multiline ? (
		<p className="text-sm whitespace-pre-wrap">{value}</p>
	) : (
		<p className="text-sm">{value}</p>
	);

	return (
		<div>
			<p className="text-xs text-muted-foreground">{label}</p>
			{inner}
		</div>
	);
}
