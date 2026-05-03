import { headers } from 'next/headers';

const apiBase = () => process.env['API_INTERNAL_URL'] ?? 'http://localhost:3001';

export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const incoming = await headers();
  const cookie = incoming.get('cookie') ?? '';
  return fetch(`${apiBase()}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(cookie ? { cookie } : {}),
    },
    cache: 'no-store',
  });
}