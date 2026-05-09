import type { Context } from 'hono';

export type SseEvent = { event?: string; data: unknown; id?: string };

export function sseStream(c: Context, run: (send: (e: SseEvent) => void) => Promise<void>) {
  const encoder = new TextEncoder();
  let isClosed = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: SseEvent) => {
        if (isClosed) return;
        const lines: string[] = [];
        if (e.event) lines.push(`event: ${e.event}`);
        if (e.id) lines.push(`id: ${e.id}`);
        lines.push(`data: ${JSON.stringify(e.data)}`);
        try {
          controller.enqueue(encoder.encode(lines.join('\n') + '\n\n'));
        } catch (err) {
          isClosed = true;
        }
      };

      // Ping a cada 15 segundos para evitar timeout de Nginx/Browser/Cloudflare (30s)
      const heartbeat = setInterval(() => {
        if (isClosed) return;
        try {
          controller.enqueue(encoder.encode(': ping\n\n'));
        } catch (err) {
          isClosed = true;
        }
      }, 15000);

      try {
        await run(send);
      } catch (err) {
        if (!isClosed) send({ event: 'error', data: { message: (err as Error).message } });
      } finally {
        clearInterval(heartbeat);
        if (!isClosed) {
          try { controller.close(); } catch {}
          isClosed = true;
        }
      }
    },
    cancel() {
      isClosed = true;
    }
  });
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache, no-transform');
  c.header('Connection', 'keep-alive');
  c.header('X-Accel-Buffering', 'no');
  return c.body(stream);
}
