import { getEnvConfig } from "@/lib/env";
import { AppError } from "@/lib/errors";
import { UploadSignaturePayload } from "@/types/upload";
import { v2 as cloudinary } from "cloudinary";

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
