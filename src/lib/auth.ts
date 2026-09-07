import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { INITIAL_USER } from '@/lib/mockData';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Kata Sandi', type: 'password' },
        isDemo: { label: 'Demo Mode', type: 'text' },
      },
      async authorize(credentials) {
        // If Demo mode is activated
        if (credentials?.isDemo === 'true' || credentials?.email === 'budi@mahasiswa.ac.id') {
          return {
            id: INITIAL_USER.id,
            name: INITIAL_USER.name,
            email: INITIAL_USER.email,
            image: undefined,
          };
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.passwordHash) {
            return null;
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash);

          if (!isValid) {
            return null;
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.warn('Fallback to Demo Auth User due to DB query:', error);
          return {
            id: INITIAL_USER.id,
            name: INITIAL_USER.name,
            email: INITIAL_USER.email,
          };
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'nata-app-super-secret-key-2026-mahasiwa-kos',
});
