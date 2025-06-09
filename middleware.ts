import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  providers: [],
  callbacks: {
    async authorized({ request, auth }: any) {
      const protectedPaths = [
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      const { pathname } = request.nextUrl;

      const isProtected = protectedPaths.some((p) => p.test(pathname));

      if (isProtected && !auth?.user) {
        return false; // Not authorized
      }

      // ✅ DELETE the callback cookie if it exists
      if (request.cookies.has("__Secure-authjs.callback-url")) {
        const response = NextResponse.next();
        response.cookies.set("__Secure-authjs.callback-url", "", {
          path: "/",
          expires: new Date(0),
          httpOnly: true,
          secure: true,
          sameSite: "lax", // ✅ lowercase
        });
        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
