import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = request.cookies.get("_session")?.value;

  if (!session && path !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/story", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/story", "/dashboard", "/complete"],
};
