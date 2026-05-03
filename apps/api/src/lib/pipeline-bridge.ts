import { AnthropicLlmClient } from '@lume/ai';
import type { LlmClient } from '@lume/ai';
import { env } from '../env.js';

let client: LlmClient | null = null;

export function getLlmClient(): LlmClient {
  if (!client) {
    client = new AnthropicLlmClient({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export function setLlmClientForTest(c: LlmClient | null): void {
  client = c;
}
