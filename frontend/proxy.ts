import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  // If trying to access admin routes without being logged in
  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    return Response.redirect(new URL("/admin/login", req.nextUrl.origin))
  }

  // If already logged in and trying to access login page
  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin", req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
}