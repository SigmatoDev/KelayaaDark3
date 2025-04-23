import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string | null;
      id?: string | null;
      isAdmin?: boolean;
      mobileNumber?: string; 
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    _id?: string;
    id?: string;
    isAdmin?: boolean;
  }

  interface JWT {
    id?: string;
    isAdmin?: boolean;
  }
}
