import { getEnvConfig } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { UploadSignaturePayload } from "@/types/upload";
import { v2 as cloudinary } from "cloudinary";

type ImageTransformOptions = {
	width?: number;
	height?: number;
	crop?: string;
	format?: string;
	quality?: string;
	watermark?: string;
	download?: boolean;
};

function encodePublicId(publicId: string) {
	return publicId
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
}

function buildTransformString({
	width,
	height,
	crop,
	format = "auto",
	quality = "auto",
	watermark,
	download,
}: ImageTransformOptions) {
	const pieces: string[] = [];
	if (width) pieces.push(`w_${width}`);
	if (height) pieces.push(`h_${height}`);
	if (crop) pieces.push(`c_${crop}`);
	if (format) pieces.push(`f_${format}`);
	if (quality) pieces.push(`q_${quality}`);
	if (watermark) {
		pieces.push(
			`l_text:Arial_52_bold:${encodeURIComponent(watermark)}`,
		);
		pieces.push("g_south_east");
		pieces.push("x_80");
		pieces.push("y_80");
		pieces.push("o_80");
		pieces.push("co_black");
		pieces.push("b_white");
		pieces.push("r_16");
	}
	if (download) {
		pieces.push("fl_attachment");
	}

	return pieces.length ? pieces.join(",") : "f_auto,q_auto";
}

export function buildCloudinaryImageUrl(
	publicId: string,
	options: ImageTransformOptions = {},
) {
	const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_FOLDER_NAME } =
		getEnvConfig();
	const transform = buildTransformString(options);
	return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transform}/${CLOUDINARY_FOLDER_NAME}/${encodePublicId(publicId)}`;
}

export function buildProjectImageUrl(
	publicId: string,
	width = 720,
	height = 1000,
) {
	return buildCloudinaryImageUrl(publicId, {
		width,
		height,
		crop: "fill",
	});
}

export function buildProjectDownloadUrl(publicId: string) {
	return buildCloudinaryImageUrl(publicId, {
		watermark: "Neeta Bhusal",
		download: true,
	});
}

export function createUploadSignature(
	publicId: string,
): UploadSignaturePayload {
	try {
		const {
			CLOUDINARY_FOLDER_NAME,
			CLOUDINARY_API_SECRET,
			CLOUDINARY_CLOUD_NAME,
			CLOUDINARY_API_KEY,
		} = getEnvConfig();
		const timestamp = Math.round(Date.now() / 1000);

		cloudinary.config({
			cloud_name: CLOUDINARY_CLOUD_NAME,
			api_key: CLOUDINARY_API_KEY,
			api_secret: CLOUDINARY_API_SECRET,
			secure: true,
		});
		const signature = cloudinary.utils.api_sign_request(
			{
				folder: CLOUDINARY_FOLDER_NAME,
				public_id: publicId,
				timestamp,
			},
			CLOUDINARY_API_SECRET,
		);

		return {
			signature,
			publicId,
			cloudName: CLOUDINARY_CLOUD_NAME,
			timestamp,
			apiKey: CLOUDINARY_API_KEY,
			folder: CLOUDINARY_FOLDER_NAME,
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		throw new AppError(
			error.message,
			error.statusCode,
			undefined,
			error,
		);
	}
}
