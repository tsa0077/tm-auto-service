import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.adminUser.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("[auth] User not found:", credentials.email);
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!valid) {
            console.log("[auth] Invalid password for:", credentials.email);
            return null;
          }

          console.log("[auth] Login success for:", user.email);
          return { id: user.id, email: user.email, name: user.name };
        } catch (err) {
          console.error("[auth] Error in authorize:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
