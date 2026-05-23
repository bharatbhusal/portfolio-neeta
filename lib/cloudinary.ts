import { v2 as cloudinary } from "cloudinary";
import { getEnvConfig } from "./env";
import { AppError } from "./errors";
import type {
	UploadedAsset,
	UploadSignaturePayload,
} from "@/types/upload";

export function createUploadSignature(
	publicId: string,
): string {
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
				timestamp,
				...{ public_id: publicId },
			},
			CLOUDINARY_API_SECRET,
		);

		return signature;
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

export async function uploadImageToCloudinary(
	file: File,
	signature: UploadSignaturePayload,
	onProgress?: (progress: number) => void,
): Promise<UploadedAsset> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("api_key", signature.apiKey);
	formData.append("timestamp", String(signature.timestamp));
	formData.append("signature", signature.signature);
	formData.append("folder", signature.folder);
	if (signature.publicId) {
		formData.append("public_id", signature.publicId);
	}

	const response = await new Promise<UploadedAsset>(
		(resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.open(
				"POST",
				`https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
			);

			xhr.upload.onprogress = (event) => {
				if (!event.lengthComputable || !onProgress) return;
				onProgress(
					Math.round((event.loaded / event.total) * 100),
				);
			};

			xhr.onerror = () =>
				reject(new Error("Upload failed due to network error"));
			xhr.onload = () => {
				if (xhr.status < 200 || xhr.status >= 300) {
					const details = xhr.responseText
						? `: ${xhr.responseText}`
						: "";
					reject(
						new Error(
							`Upload failed with status ${xhr.status}${details}`,
						),
					);
					return;
				}

				const payload = JSON.parse(xhr.responseText) as {
					public_id: string;
					bytes: number;
					format: string;
					width: number;
					height: number;
					secure_url: string;
				};

				resolve({
					publicId: payload.public_id,
					bytes: payload.bytes,
					format: payload.format,
					width: payload.width,
					height: payload.height,
					secureUrl: payload.secure_url,
				});
			};

			xhr.send(formData);
		},
	);

	return response;
}
