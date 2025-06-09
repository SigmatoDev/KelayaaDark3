import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";

const authConfig: NextAuthConfig = {
  providers: [],
  callbacks: {
    /**
     * Ensures that all callback URLs are redirected to `kelayaa.com` in production
     * and `staging.kelayaa.com` in staging.
     */
    async redirect({ url, baseUrl }) {
      // Determine the environment (production or staging)
      const isProduction = process.env.NODE_ENV === 'production';
      
      // Set callback URL based on environment
      const callbackUrl = isProduction
        ? 'https://kelayaa.com/callback'   // Production environment callback
        : 'https://staging.kelayaa.com/callback'; // Staging environment callback (if needed)

      // Ensure the redirect URL always points to the correct domain
      if (url.startsWith(baseUrl)) {
        return callbackUrl; // Force the callback to the correct URL
      }

      return isProduction ? 'https://kelayaa.com' : 'https://staging.kelayaa.com'; // Default fallback
    },

    async authorized({ request, session }: any) {
      const protectedPaths = [
        /\/payment/,
        /\/place-order/,
        /\/profile/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      const { pathname } = request.nextUrl;

      // If auth exists, allow access to protected paths
      if (protectedPaths.some((p) => p.test(pathname))) {
        return !!session?.user; // Ensure session contains a user object
      }

      return true; // For non-protected paths, allow access
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page if necessary
    error: "/auth/error", // Custom error page if necessary
    // Other page overrides can go here
  },
} satisfies NextAuthConfig;

// Export NextAuth middleware
export const { auth: middleware } = NextAuth(authConfig);

// Apply NextAuth to all routes except API, static files, etc.
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Match all requests except the ones for APIs, static files, or favicon
  ],
};
