import type { Context } from 'hono';

export type SseEvent = { event?: string; data: unknown; id?: string };

export function sseStream(c: Context, run: (send: (e: SseEvent) => void) => Promise<void>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: SseEvent) => {
        const lines: string[] = [];
        if (e.event) lines.push(`event: ${e.event}`);
        if (e.id) lines.push(`id: ${e.id}`);
        lines.push(`data: ${JSON.stringify(e.data)}`);
        controller.enqueue(encoder.encode(lines.join('\n') + '\n\n'));
      };
      try {
        await run(send);
      } catch (err) {
        send({ event: 'error', data: { message: (err as Error).message } });
      } finally {
        controller.close();
      }
    },
  });
  c.header('Content-Type', 'text/event-stream');
  c.header('Cache-Control', 'no-cache, no-transform');
  c.header('Connection', 'keep-alive');
  c.header('X-Accel-Buffering', 'no');
  return c.body(stream);
}
