import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwt_key } from "./utils/phrase_formatter";

const dashPaths = ["collections", "broadcast", "new"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const session = request.cookies.get("_session")?.value;

  if (path === "/" && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (path.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path.startsWith("/dashboard/broadcast") && session) {
    const { payload } = await jwtVerify(session, jwt_key);
    const reqAddress = path.split("/")[3];
    const { address } = payload as { address: string };

    if (reqAddress && reqAddress !== address) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.rewrite(new URL(`/dashboard/broadcast/${address}`, request.url));
  }

  if (path.startsWith("/dashboard/collection") && session) {
    const { payload } = await jwtVerify(session, jwt_key);
    const { collections } = payload as { collections: string[] };
    const reqAddress = path.split("/")[3];
    if (!collections.includes(reqAddress ?? "")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (path === "/dashboard/new" && session) {
    return NextResponse.next();
  }

  if (path.startsWith("/dashboard") && session) {
    const { payload } = await jwtVerify(session, jwt_key);

    const reqAddress = path.split("/")[2];
    const { address } = payload as { address: string };

    if (reqAddress && ![...dashPaths, address].includes(reqAddress)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.rewrite(new URL(`/dashboard/${address}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
