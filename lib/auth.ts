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
  trustHost: true,
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
        try {
          await dbConnect();
    
          if (!credentials?.email || !credentials?.password) {
            console.error("Missing email or password");
            return null; // Instead of throwing
          }
    
          const user = await UserModel.findOne({ email: credentials.email });
    
          if (!user || !user.password) {
            console.error("User not found or password missing");
            return null;
          }
    
          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
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
          console.error("Authorize() failed:", error);
          return null;
        }
      }
    })
    

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
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
  ,
  
  

  secret: process.env.NEXTAUTH_SECRET,

  
  debug: true, // optional for debugging errors
});
