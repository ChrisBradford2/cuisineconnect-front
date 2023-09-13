import NextAuth from "next-auth"
import { Session, User } from 'next-auth';
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          include_granted_scopes: "true",
        },
      },
    })
  ],
  // A database is optional, but required to persist accounts in a database
  database: process.env.DATABASE_URL || "",
  session: {
    strategy: "jwt",
  },
}

export default NextAuth(authOptions as any)
