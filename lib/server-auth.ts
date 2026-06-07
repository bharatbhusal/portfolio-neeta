import { getAuthPayload } from "./auth";

export async function isAuthenticated(): Promise<boolean> {
	try {
		await getAuthPayload();
		return true;
	} catch {
		return false;
	}
}
