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

// ---------------------------------------------------------------------------
// Client-side helpers (browser fetch, credentials: 'include')
// ---------------------------------------------------------------------------

const apiUrl = () =>
  process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function uploadFiles(files: File[]): Promise<{ fileCount: number }> {
  const fd = new FormData();
  for (const f of files) fd.append('files', f, f.name);
  const res = await fetch(`${apiUrl()}/sessions/upload`, {
    method: 'POST',
    body: fd,
    credentials: 'include',
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new ApiError(res.status, body.error ?? 'upload_failed');
  }
  return res.json() as Promise<{ fileCount: number }>;
}

export async function ensureSession(): Promise<{ sessionId: string }> {
  const res = await fetch(`${apiUrl()}/sessions`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new ApiError(res.status, 'session_create_failed');
  return res.json() as Promise<{ sessionId: string }>;
}

export type StreamEvent =
  | { type: 'stage'; stage: string; index: number; total: number }
  | { type: 'completed'; reportId: string }
  | { type: 'error'; code: string; message: string };

export async function streamReport(
  sessionId: string,
  onEvent: (e: StreamEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${apiUrl()}/reports/generate/stream`, {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
    headers: { 'content-type': 'application/json' },
    credentials: 'include',
    signal,
  });
  if (res.status === 429) {
    const body = (await res.json()) as { nextAvailableAt: string };
    onEvent({ type: 'error', code: 'cap_reached', message: body.nextAvailableAt });
    return;
  }
  if (!res.ok || !res.body) {
    onEvent({ type: 'error', code: 'http_' + res.status, message: 'stream_failed' });
    return;
  }
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let idx;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const ev = block.match(/^event: (.+)$/m)?.[1] ?? 'message';
      const dataLine = block.match(/^data: (.+)$/m);
      if (!dataLine) continue;
      const data = JSON.parse(dataLine[1]!) as Record<string, unknown>;
      if (ev === 'stage') onEvent({ type: 'stage', ...data } as StreamEvent);
      else if (ev === 'completed') onEvent({ type: 'completed', ...data } as StreamEvent);
      else if (ev === 'error') onEvent({ type: 'error', ...data } as StreamEvent);
    }
  }
}