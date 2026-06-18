import nodemailer from "nodemailer";

import { getEnvConfig } from "./env";

const LOGO_TYPE_LABELS: Record<string, string> = {
	text_logo: "Text Logo (Wordmark)",
	icon_logo: "Icon Logo (Symbol)",
	combination_logo: "Combination Logo",
	mascot_logo: "Mascot Logo",
	abstract_logo: "Abstract Logo",
};

const STATUS_LABELS: Record<string, string> = {
	pending: "Pending",
	reviewed: "Reviewed",
	accepted: "Accepted",
	declined: "Declined",
};

const BASE_URL = "https://neetabhusal.vercel.app";

function getTransporter() {
	const { SMTP_HOST, SMTP_PORT, SMTP_MAIL_ID, SMTP_PASSWORD } = getEnvConfig();

	if (!SMTP_HOST || !SMTP_MAIL_ID || !SMTP_PASSWORD) {
		throw new Error("SMTP not configured");
	}

	return nodemailer.createTransport({
		host: SMTP_HOST,
		port: Number(SMTP_PORT),
		secure: SMTP_PORT === "465",
		auth: {
			user: SMTP_MAIL_ID,
			pass: SMTP_PASSWORD,
		},
	});
}

function formatList(items: string[] | undefined): string {
	if (!items || items.length === 0) return "—";
	return items.join(", ");
}

function wrapHtml(subject: string, body: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    @media only screen and (max-width:600px) {
      .container { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;">
  <div class="container" style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;box-shadow:0 2px 12px rgba(0,0,0,0.06);padding:40px;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="text-align:center;margin-bottom:28px;">
      <h2 style="color:#1a237e;margin:0;font-size:1.5em;letter-spacing:0.3px;">${subject}</h2>
    </div>
    <div style="color:#333;font-size:1em;line-height:1.7;">${body}</div>
    <hr style="border:none;border-top:1px solid #e3e8f0;margin:28px 0 16px;" />
    <div style="text-align:center;color:#888;font-size:0.9em;">
      <p style="margin:0 0 2px;">Best regards,</p>
      <p style="margin:0 0 2px;font-weight:500;color:#1a237e;">Neeta Bhusal — Portfolio</p>
      <p style="margin:16px 0 0;font-size:0.85em;color:#b0b0b0;">&copy; ${new Date().getFullYear()} Neeta Bhusal</p>
    </div>
  </div>
</body>
</html>`;
}

function ctaButton(url: string, label: string): string {
	return `<div style="text-align:center;margin:24px 0;">
  <a href="${url}" style="display:inline-block;background:#1a237e;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:500;font-size:0.95em;">${label}</a>
</div>`;
}

type RequestData = {
	_id?: string;
	name?: string;
	email?: string;
	phone?: string;
	brandName?: string;
	businessDescription?: string;
	targetAudience?: string;
	brandKeywords?: string[];
	logoFeeling?: string[];
	logoType?: string;
	colors?: string;
	symbols?: string;
	inspiration?: string;
	usage?: string[];
	fileFormats?: string[];
	additionalNotes?: string;
	status?: string;
};

export async function sendAdminAlert(
	data: RequestData,
	recipientEmail: string,
) {
	const { SMTP_MAIL_ID } = getEnvConfig();
	const transporter = getTransporter();

	const name = data.name ?? "Unknown";
	const clientEmail = data.email ?? "";
	const phone = data.phone ?? "";
	const brandName = data.brandName ?? "";
	const businessDescription = data.businessDescription ?? "";
	const targetAudience = data.targetAudience ?? "";
	const brandKeywords = data.brandKeywords;
	const logoFeeling = data.logoFeeling;
	const logoType = data.logoType ?? "";
	const colors = data.colors ?? "";
	const symbols = data.symbols ?? "";
	const inspiration = data.inspiration ?? "";
	const usage = data.usage;
	const fileFormats = data.fileFormats;
	const additionalNotes = data.additionalNotes ?? "";

	const fields = [
		`<strong>Client Name:</strong> ${name}`,
		`<strong>Email:</strong> ${clientEmail}`,
		phone ? `<strong>Phone:</strong> ${phone}` : "",
		"<br />",
		`<strong>Brand Name:</strong> ${brandName}`,
		businessDescription
			? `<strong>What does your business do?</strong><br />${businessDescription.replace(/\n/g, "<br />")}`
			: "",
		targetAudience
			? `<strong>Target Audience:</strong><br />${targetAudience.replace(/\n/g, "<br />")}`
			: "",
		`<strong>Brand Keywords:</strong> ${formatList(brandKeywords)}`,
		`<strong>Desired Feeling:</strong> ${formatList(logoFeeling)}`,
		`<strong>Logo Type:</strong> ${LOGO_TYPE_LABELS[logoType] ?? logoType}`,
		colors
			? `<strong>Preferred Colors:</strong><br />${colors.replace(/\n/g, "<br />")}`
			: "",
		symbols
			? `<strong>Symbols / Icons:</strong><br />${symbols.replace(/\n/g, "<br />")}`
			: "",
		inspiration
			? `<strong>Inspiration / References:</strong><br />${inspiration.replace(/\n/g, "<br />")}`
			: "",
		`<strong>Usage:</strong> ${formatList(usage)}`,
		`<strong>File Formats Needed:</strong> ${formatList(fileFormats)}`,
		additionalNotes
			? `<strong>Additional Notes:</strong><br />${additionalNotes.replace(/\n/g, "<br />")}`
			: "",
	]
		.filter(Boolean)
		.join("<br /><br />");

	const subject = `New Logo Design Request: ${brandName}`;
	const adminLink = `${BASE_URL}/admin/requests`;

	const body = `${fields}
<br />
<hr />
<p style="color:#888;font-size:13px;">
  <a href="${adminLink}" style="color:#1a237e;">View in admin dashboard</a>
</p>`;

	await transporter.sendMail({
		from: SMTP_MAIL_ID,
		to: recipientEmail,
		subject,
		html: wrapHtml(subject, body),
	});
}

export async function sendClientConfirmation(
	data: RequestData,
	recipientEmail: string,
) {
	const { SMTP_MAIL_ID } = getEnvConfig();
	const transporter = getTransporter();

	const brandName = data.brandName ?? "";
	const name = data.name ?? "there";
	const requestId = data._id ?? "";

	const subject = `We've received your logo design request!`;
	const publicLink = `${BASE_URL}/request/${requestId}`;

	const body = `<p>Hi ${name},</p>
<p>Thank you for submitting your logo design request for <strong>${brandName}</strong>! I've received it and am excited to work with you.</p>
<p>Here's what happens next:</p>
<ol style="margin:8px 0 16px 20px;padding:0;line-height:1.9;">
  <li>I'll review your requirements within <strong>48 hours</strong>.</li>
  <li>If I have any questions, I'll reach out to you at this email address.</li>
  <li>Once reviewed, I'll update the status of your request — you'll get another email when that happens.</li>
</ol>
<p>You can check the status of your request anytime using the link below:</p>
${ctaButton(publicLink, "View Your Request Status")}
<p style="margin-top:20px;color:#888;font-size:0.93em;">If you have any questions in the meantime, feel free to reply to this email.</p>`;

	await transporter.sendMail({
		from: SMTP_MAIL_ID,
		to: recipientEmail,
		subject,
		html: wrapHtml(subject, body),
	});
}

export async function sendStatusUpdateEmail(
	data: RequestData,
	recipientEmail: string,
) {
	const { SMTP_MAIL_ID } = getEnvConfig();
	const transporter = getTransporter();

	const brandName = data.brandName ?? "";
	const name = data.name ?? "there";
	const status = data.status ?? "pending";
	const requestId = data._id ?? "";

	const messages: Record<string, string> = {
		pending: "Your request is now in the queue and awaiting review.",
		reviewed:
			"Your request has been reviewed. I'll be in touch shortly to discuss the next steps.",
		accepted:
			"Great news! Your logo design request has been accepted. I'll start working on the concepts and reach out to you soon.",
		declined:
			"After careful consideration, I'm unable to take on this project at this time. I appreciate your interest and understanding.",
	};

	const subject = `Request ${STATUS_LABELS[status] ?? status}: ${brandName}`;
	const publicLink = `${BASE_URL}/request/${requestId}`;

	const body = `<p>Hi ${name},</p>
<p>The status of your logo design request for <strong>${brandName}</strong> has been updated to <strong>${STATUS_LABELS[status] ?? status}</strong>.</p>
<p>${messages[status] ?? ""}</p>
${ctaButton(publicLink, "View Your Request")}
<p style="margin-top:20px;color:#888;font-size:0.93em;">If you have any questions, feel free to reply to this email.</p>`;

	await transporter.sendMail({
		from: SMTP_MAIL_ID,
		to: recipientEmail,
		subject,
		html: wrapHtml(subject, body),
	});
}
