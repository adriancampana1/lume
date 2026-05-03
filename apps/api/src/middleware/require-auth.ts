import type { MiddlewareHandler } from 'hono';
import { getAuthUser, initAuthConfig } from '@hono/auth-js';
import { eq } from 'drizzle-orm';
import { db, users } from '@lume/db';
import { authConfig } from '../lib/auth.js';
import type { Variables } from '../types.js';

export const requireAuth: MiddlewareHandler<{ Variables: Variables }> = async (c, next) => {
  await initAuthConfig(() => authConfig)(c, async () => {});
  const session = await getAuthUser(c);
  if (!session?.user?.id) {
    return c.json({ error: 'unauthorized' }, 401);
  }
  const [row] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!row || row.deletedAt) {
    return c.json({ error: 'unauthorized' }, 401);
  }
  c.set('user', {
    id: row.id,
    email: row.email,
    name: row.name,
    image: row.image,
    incomeBracket: row.incomeBracket,
    marketingOptIn: row.marketingOptIn,
    hasOnboarded: row.incomeBracket !== null,
  });
  await next();
};