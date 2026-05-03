import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db, users } from '@lume/db';
import { OnboardingPayloadSchema } from '@lume/shared';
import { requireAuth } from '../middleware/require-auth.js';
import type { Variables } from '../types.js';

export const onboardingRoute = new Hono<{ Variables: Variables }>();

onboardingRoute.post('/', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'unauthorized' }, 401);

  let payload: unknown;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_json' }, 400);
  }
  const parsed = OnboardingPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    return c.json({ error: 'invalid_payload', issues: parsed.error.issues }, 400);
  }

  await db
    .update(users)
    .set({
      incomeBracket: parsed.data.incomeBracket,
      marketingOptIn: parsed.data.marketingOptIn,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return c.json({ ok: true, incomeBracket: parsed.data.incomeBracket });
});