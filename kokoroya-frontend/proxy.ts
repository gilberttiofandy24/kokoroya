import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("auth_token");
  const isSignIn = request.nextUrl.pathname === "/sign-in";

  if (isSignIn) {
    if (hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!hasToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
