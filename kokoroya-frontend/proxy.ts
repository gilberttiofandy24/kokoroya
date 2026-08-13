import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const hasToken = request.cookies.has("auth_token");
  const hasBranch = request.cookies.has("selected_branch");
  const pathname = request.nextUrl.pathname;
  const isSignIn = pathname === "/sign-in";
  const isSelectBranch = pathname === "/select-branch";
  const isStore = pathname === "/store";

  if (isSignIn) {
    if (hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return;
  }

  if (!hasToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (!isSelectBranch && !isStore && !hasBranch) {
    return NextResponse.redirect(new URL("/select-branch", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
