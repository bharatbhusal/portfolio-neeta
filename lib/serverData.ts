import { readFile } from "fs/promises";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");

export async function readJson<T>(
	filename: string,
): Promise<T> {
	const safeName = filename.startsWith("/")
		? filename.slice(1)
		: filename;
	const filePath = join(DATA_DIR, safeName);
	const contents = await readFile(filePath, "utf-8");
	return JSON.parse(contents) as T;
}
