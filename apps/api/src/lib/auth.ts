import { DrizzleAdapter } from '@auth/drizzle-adapter';
import type { AuthConfig } from '@auth/core';
import Google from '@auth/core/providers/google';
import { db } from '@lume/db';
import { accounts, sessions, users, verificationTokens } from '@lume/db';
import { env } from '../env.js';

export const authConfig: AuthConfig = {
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: 'database' },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts as any,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: { params: { prompt: 'select_account' } },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=oauth',
  },
};