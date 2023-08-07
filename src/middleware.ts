import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = request.cookies.get("_session")?.value;

  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/story", request.url));
  }

  if (path.startsWith("/story") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/story"],
};
