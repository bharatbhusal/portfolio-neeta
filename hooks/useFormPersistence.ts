"use client";

const STORAGE_KEY = "project-request-draft";

export function getPersistedValues<T extends Record<string, unknown>>(
	defaultValues: T,
): T {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved) as Partial<T>;
			return { ...defaultValues, ...parsed };
		}
	} catch {
		// Ignore parse errors
	}
	return defaultValues;
}

export function persistValues<T>(values: T): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
	} catch {
		// Ignore storage errors
	}
}

export function clearPersistedValues(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// Ignore storage errors
	}
}
