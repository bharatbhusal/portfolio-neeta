import type {
	UploadedAsset,
	UploadSignaturePayload,
} from "@/types/upload";

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
