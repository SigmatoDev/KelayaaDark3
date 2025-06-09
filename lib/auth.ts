import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";

export const config = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials) {
        await dbConnect();
        if (credentials === null) return null;

        const user = await UserModel.findOne({ email: credentials.email });

        if (user) {
          const isMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  // 👇 Add this block for cookie domain setting
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        domain: `.kelayaa.com`, // ✅ This ensures cookies work across subdomains
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true, // ✅ Required for HTTPS (staging & prod)
      },
    },
  },
  // custom pages for sign in and register
  pages: {
    signIn: "/signin",
    newUser: "/register",
    error: "/error",
  },
  callbacks: {
    async jwt({ user, trigger, session, token }: any) {
      if (user) {
        token.user = {
          _id: user._id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          mobileNumber: user.mobileNumber,
        };
      }
      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
          mobileNumber: session.user.mobileNumber,
        };
      }
      return token;
    },
    session: async ({ session, token }: any) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
