import { describe, expect, it } from 'vitest';
import { app } from '../src/index.js';
describe('GET /db-check', () => {
    it('returns 200 when DB is reachable', async () => {
        const res = await app.request('/db-check');
        expect(res.status).toBe(200);
        const body = (await res.json());
        expect(body.ok).toBe(true);
    });
});
