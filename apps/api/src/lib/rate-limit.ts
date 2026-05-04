type Bucket = { count: number; resetAt: number };
const ipBuckets = new Map<string, Bucket>();

export function checkIpRate(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const cur = ipBuckets.get(ip);
  if (!cur || cur.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (cur.count >= limit) return false;
  cur.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of ipBuckets.entries()) {
    if (v.resetAt < now) ipBuckets.delete(k);
  }
}, 60 * 1000).unref?.();

export function _resetForTests() {
  ipBuckets.clear();
}
