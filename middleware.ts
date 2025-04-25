import type { NextRequest } from "next/server"

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next()
//   const supabase = createMiddlewareClient({ req, res })

//   const {
//     data: { session },
//   } = await supabase.auth.getSession()

//   // Authentication check for protected routes
//   const protectedRoutes = ["/lists", "/learn", "/profile"]
//   const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

//   // Auth routes that should redirect to /lists if already logged in
//   const authRoutes = ["/login", "/register"]
//   const isAuthRoute = authRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

//   // Redirect if accessing protected route without session
//   if (isProtectedRoute && !session) {
//     const redirectUrl = new URL("/login", req.url)
//     redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
//     return NextResponse.redirect(redirectUrl)
//   }

//   // Redirect if accessing auth routes with session
//   if (isAuthRoute && session) {
//     return NextResponse.redirect(new URL("/lists", req.url))
//   }

//   return res
// }

// export const config = {
//   matcher: ["/lists/:path*", "/learn/:path*", "/profile/:path*", "/login", "/register"],
// }


import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}