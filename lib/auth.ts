import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  trustHost: true, // ✅ Good

  session: {
    strategy: "jwt", // ✅ Needed, missing earlier
    maxAge: 30 * 24 * 60 * 60, // (Optional) 30 days login valid
  },

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();
      
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password");
            return null;
          }
      
          const user = await UserModel.findOne({ email: credentials.email });
      
          if (!user) {
            console.error("User not found");
            return null;
          }
      
          if (!user.password || typeof user.password !== "string") {
            console.error("Invalid password stored for user");
            return null;
          }
      
          const isValid = await bcrypt.compare(
            String(credentials.password),
            String(user.password)
          );
      
          if (!isValid) {
            console.error("Password mismatch");
            return null;
          }
      
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Authorize failed:", error);
          return null;
        }
      }
      
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      if (token?.isAdmin !== undefined) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // ✅ Must match between frontend and server

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },

  debug: true, // ✅ Good for finding errors
});
