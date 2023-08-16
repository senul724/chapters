import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwt_key } from "./utils/phrase_formatter";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = request.cookies.get("_session")?.value;

  if (!session && path !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/story", request.url));
  }

  if (path === "/activities" && session) {
    const { payload } = await jwtVerify(session, jwt_key);
    const { address } = payload as { address: string };

    return NextResponse.rewrite(new URL(`/activities/${address}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/story", "/complete", "/activities"],
};
