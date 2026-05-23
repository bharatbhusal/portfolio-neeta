import { headers } from "next/headers";
import { cache } from "react";

async function getOrigin() {
	const headerList = await headers();
	const protocol =
		headerList.get("x-forwarded-proto") ?? "http";
	const host =
		headerList.get("x-forwarded-host") ??
		headerList.get("host") ??
		"localhost:3000";

	return `${protocol}://${host}`;
}

export async function fetchJson<T>(
	path: string,
): Promise<T> {
	const resolvedPath = path.startsWith("/")
		? path
		: `/${path}`;
	const response = await fetch(
		`${await getOrigin()}${resolvedPath}`,
		{
			cache: "force-cache",
			next: {
				revalidate: 60 * 60,
			},
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${resolvedPath}: ${response.status} ${response.statusText}`,
		);
	}

	return response.json() as Promise<T>;
}

export async function fetchJsonNoStore<T>(
	path: string,
): Promise<T> {
	const resolvedPath = path.startsWith("/")
		? path
		: `/${path}`;
	const response = await fetch(
		`${await getOrigin()}${resolvedPath}`,
		{
			cache: "no-store",
		},
	);

	if (!response.ok) {
		throw new Error(
			`Failed to fetch ${resolvedPath}: ${response.status} ${response.statusText}`,
		);
	}

	return response.json() as Promise<T>;
}

export const getJson = cache(fetchJson);
