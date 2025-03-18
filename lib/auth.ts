import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";

export const config = {
  providers: [
    // Credentials (Email & Password) Login
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        console.log("Received credentials:", credentials);
        await dbConnect();
        if (!credentials) return null;

        const user = await UserModel.findOne({ email: credentials.email });
        console.log("User found:", user);

        if (!user) {
          throw new Error("No user found with this email.");
        }

        // If user registered via Google, prevent login with password
        if (user.provider === "google") {
          throw new Error(
            "This email is registered via Google. Please log in with Google."
          );
        }

        const isMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        console.log("Password match:", isMatch);

        if (!isMatch) {
          throw new Error("Invalid password.");
        }

        return user;
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      async profile(profile) {
        await dbConnect();
        console.log("Google Profile:", profile);

        let user = await UserModel.findOne({ email: profile.email });

        if (!user) {
          // If user does not exist, create a new one
          user = await UserModel.create({
            name: profile.name,
            email: profile.email,
            provider: "google", // Mark as Google user
          });
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

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
          isAdmin: user.isAdmin || false,
          provider: user.provider, // Store provider info
        };
      }

      if (trigger === "update" && session) {
        token.user = {
          ...token.user,
          email: session.user.email,
          name: session.user.name,
        };
      }

      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(config);
