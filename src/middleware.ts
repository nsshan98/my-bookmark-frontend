import { NextResponse } from "next/server";
import { auth } from "./auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  console.log(path);

  // Public Routes
  const homeRoutes = "/";
  const publicRoutes = ["/auth/login", "/auth/signup", "/readme"];

  const isAuthenticated = !!req.auth;
  const isHomeRoutes = homeRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // Redirect unauthenticated users ONLY if not on a public route
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect authenticated users away from public routes
  if (isAuthenticated && isHomeRoutes) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
