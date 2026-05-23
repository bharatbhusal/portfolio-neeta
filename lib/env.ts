type EnvConfig = {
	NODE_ENV: string;

	MONGODB_URI: string;
	MONGODB_DB: string;

	JWT_SECRET: string;
	AUTH_COOKIE_NAME: string;
	JWT_MAX_AGE: number;

	CLOUDINARY_CLOUD_NAME: string;
	CLOUDINARY_API_KEY: string;
	CLOUDINARY_API_SECRET: string;
	CLOUDINARY_FOLDER_NAME: string;
};

function requireEnv(name: string) {
	const value = process.env[name];
	if (!value) {
		console.warn(`Missing environment variable: ${name}`);
		return "";
	}
	return value;
}

export function getEnvConfig(): EnvConfig {
	return {
		NODE_ENV: requireEnv("NODE_ENV"),

		MONGODB_URI: requireEnv("MONGODB_URI"),
		MONGODB_DB: process.env.MONGODB_DB ?? "portfolio_neeta",

		JWT_SECRET: requireEnv("JWT_SECRET"),
		AUTH_COOKIE_NAME: requireEnv("AUTH_COOKIE_NAME"),
		JWT_MAX_AGE: parseInt(requireEnv("JWT_MAX_AGE")),

		CLOUDINARY_CLOUD_NAME: requireEnv(
			"CLOUDINARY_CLOUD_NAME",
		),
		CLOUDINARY_API_KEY: requireEnv("CLOUDINARY_API_KEY"),
		CLOUDINARY_API_SECRET: requireEnv(
			"CLOUDINARY_API_SECRET",
		),
		CLOUDINARY_FOLDER_NAME: requireEnv(
			"CLOUDINARY_FOLDER_NAME",
		),
	};
}
