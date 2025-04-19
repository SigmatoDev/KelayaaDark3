import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    // 🔐 Credentials (Email & Password) Login
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await UserModel.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // ✅ Return a plain object (not raw mongoose document)
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),

    // 🔗 Google OAuth
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   allowDangerousEmailAccountLinking: true,
    //   async profile(profile) {
    //     await dbConnect();

    //     let user = await UserModel.findOne({ email: profile.email });

    //     if (!user) {
    //       user = await UserModel.create({
    //         name: profile.name,
    //         email: profile.email,
    //         provider: "google",
    //       });
    //     }

    //     return {
    //       id: user._id.toString(),
    //       name: user.name,
    //       email: user.email,
    //       isAdmin: user.isAdmin,
    //     };
    //   },
    // }),
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
      if (token) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  
  

  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // optional for debugging errors
});
