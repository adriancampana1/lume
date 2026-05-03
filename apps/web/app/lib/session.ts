import { redirect } from 'next/navigation';
import { SessionUserSchema, type SessionUser } from '@lume/shared';
import { apiFetch } from './api.js';

export async function getCurrentUser(): Promise<SessionUser | null> {
  const res = await apiFetch('/me');
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/me failed: ${res.status}`);
  const json = await res.json();
  return SessionUserSchema.parse(json);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!user) redirect('/login?next=/conta' as any);
  return user;
}