import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth";
import { getEnvConfig } from "@/lib/env";

const protectedPaths = [
	"/admin",
	/\/admin\/projects\/[^/]+$/,
	"/admin/requests",
];

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	const isProtected = protectedPaths.some((path) => {
		if (path instanceof RegExp) {
			return path.test(pathname);
		}

		return pathname === path;
	});

	if (!isProtected) {
		return NextResponse.next();
	}

	const { AUTH_COOKIE_NAME } = getEnvConfig();

	const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

	if (!token) {
		return redirectToLogin(request, pathname);
	}

	const payload = verifyToken(token);

	if (!payload) {
		return redirectToLogin(request, pathname);
	}

	return NextResponse.next();
}

function redirectToLogin(
	request: NextRequest,
	pathname: string,
) {
	const url = request.nextUrl.clone();

	url.pathname = "/admin/login";
	url.searchParams.set("next", pathname);

	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/admin/:path*"],
};
