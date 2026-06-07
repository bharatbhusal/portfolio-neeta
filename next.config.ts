import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactCompiler: true,
	outputFileTracingRoot: __dirname,
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
		],
	},
	headers: async () => [
		{
			source: "/site.json",
			headers: [
				{
					key: "Cache-Control",
					value: "public, max-age=3600",
				},
			],
		},
		{
			source: "/((?!admin|api|_next|favicon).*)",
			headers: [
				{
					key: "Cache-Control",
					value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
				},
			],
		},
	],
};

export default nextConfig;
