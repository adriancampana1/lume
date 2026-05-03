export type InputKind = 'pdf' | 'ofx';

export function detectInputKind(buf: Buffer, filename: string): InputKind {
  const head = buf.subarray(0, 256).toString('utf8');
  if (head.startsWith('%PDF-')) return 'pdf';
  if (/^OFXHEADER:/m.test(head)) return 'ofx';
  if (/<OFX>|<\?xml[^>]*\?>\s*<OFX>/i.test(head)) return 'ofx';

  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.ofx')) return 'ofx';

  throw new Error(`unsupported input: ${filename}`);
}
