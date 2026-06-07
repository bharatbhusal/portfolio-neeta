import mongoose from "mongoose";
import { getEnvConfig } from "./env";

const env_config = getEnvConfig();

type Cached = {
	conn: mongoose.Connection | null;
	promise: Promise<mongoose.Connection> | null;
};

declare global {
	var _mongoose: Cached | undefined;
}

const cached =
	global._mongoose ||
	(global._mongoose = { conn: null, promise: null });

export async function connectToDatabase() {
	if (cached.conn) {
		return cached.conn;
	}

	if (!cached.promise) {
		cached.promise = mongoose
			.connect(env_config.MONGODB_URI)
			.then((m) => m.connection as mongoose.Connection);
	}

	cached.conn = await cached.promise;
	return cached.conn;
}

export default connectToDatabase;
