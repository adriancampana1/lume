import { redirect } from 'next/navigation';
import type { Route } from 'next';
import { SessionUserSchema, type SessionUser } from '@lume/shared';
import { apiFetch } from './api-server.js';

export async function getCurrentUser(): Promise<SessionUser | null> {
  const res = await apiFetch('/me');
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`/me failed: ${res.status}`);
  const json: unknown = await res.json();
  return SessionUserSchema.parse(json);
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login?next=/conta' as Route);
  return user;
}