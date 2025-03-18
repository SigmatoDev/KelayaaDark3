import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import dbConnect from "./dbConnect";
import UserModel from "./models/UserModel";

export const { handlers: { GET, POST }, auth } = NextAuth({
  providers: [
    // Credentials (Email & Password) Login
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await UserModel.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('Invalid password');
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
          isAdmin: user.isAdmin,
        };
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
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
        session.user.id = token.id;
        session.user.isAdmin = token.isAdmin;
      }
      return session;

    }
  }
});
