import { randomUUID } from 'node:crypto';
import { db, users, sessions } from '@lume/db';

export type TestUser = {
  id: string;
  email: string;
  sessionToken: string;
  cookieHeader: string;
};

export async function createTestUser(opts: {
  email?: string;
  incomeBracket?:
    | 'up_to_3k'
    | 'from_3k_to_6k'
    | 'from_6k_to_12k'
    | 'from_12k_to_25k'
    | 'above_25k'
    | 'prefer_not_to_say';
} = {}): Promise<TestUser> {
  const id = randomUUID();
  const email = opts.email ?? `user-${id}@test.lume`;
  await db.insert(users).values({
    id,
    email,
    name: 'Test User',
    incomeBracket: opts.incomeBracket ?? null,
  });
  const sessionToken = randomUUID();
  await db.insert(sessions).values({
    sessionToken,
    userId: id,
    expires: new Date(Date.now() + 1000 * 60 * 60),
  });
  const cookieHeader = `authjs.session-token=${sessionToken}`;
  return { id, email, sessionToken, cookieHeader };
}