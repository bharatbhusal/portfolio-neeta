import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	outputFileTracingRoot: __dirname,
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
