import { describe, expect, it } from 'vitest';
import { app } from '../src/index.js';
describe('GET /health', () => {
    it('returns 200 with status ok', async () => {
        const res = await app.request('/health');
        expect(res.status).toBe(200);
        expect(res.headers.get('content-type')).toContain('application/json');
        const body = (await res.json());
        expect(body.status).toBe('ok');
        expect(typeof body.timestamp).toBe('string');
        expect(() => new Date(body.timestamp)).not.toThrow();
    });
});
