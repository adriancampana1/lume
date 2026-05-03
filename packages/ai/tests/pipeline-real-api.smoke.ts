import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { AnthropicLlmClient } from '../src/llm/anthropic.js';
import { runPipeline } from '../src/pipeline.js';

const fixturesDir = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures');
const realPdfPath = join(fixturesDir, 'real-statement.pdf');

const apiKey = process.env['ANTHROPIC_API_KEY'];

describe.skipIf(!apiKey || !existsSync(realPdfPath))(
  '[smoke] runPipeline with real Anthropic API',
  () => {
    it('produces a validated report from a real PDF', async () => {
      const llm = new AnthropicLlmClient({ apiKey: apiKey! });
      const report = await runPipeline({
        llm,
        inputs: [{ buffer: readFileSync(realPdfPath), filename: 'real-statement.pdf' }],
        incomeBracket: 'from_3k_to_6k',
        onStage: (s) => console.log('[stage]', s),
      });
      expect(report.transactionsCount).toBeGreaterThan(0);
      expect(report.narrative.summary.length).toBeGreaterThan(20);
      console.log(JSON.stringify(report, null, 2));
    }, 180000);
  },
);
