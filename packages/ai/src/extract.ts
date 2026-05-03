import { StatementSchema, type Statement } from './types.js';
import type { LlmClient } from './llm/client.js';
import { EXTRACT_SYSTEM, EXTRACT_USER } from './prompts.js';

export type ExtractInput = {
  llm: LlmClient;
  pdf: Buffer;
  filename: string;
};

function stripFences(s: string): string {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

export async function extractStatementFromPdf(input: ExtractInput): Promise<Statement> {
  const result = await input.llm.call({
    model: 'claude-sonnet-4-6',
    system: EXTRACT_SYSTEM,
    maxTokens: 8000,
    temperature: 0,
    input: [
      { kind: 'pdf', data: input.pdf, filename: input.filename },
      { kind: 'text', text: EXTRACT_USER },
    ],
  });

  const cleaned = stripFences(result.text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`extract: invalid JSON from LLM: ${(err as Error).message}`);
  }
  return StatementSchema.parse(parsed);
}
