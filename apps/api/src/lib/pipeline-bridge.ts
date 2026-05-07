import { AnthropicLlmClient } from '@lume/ai';
import type { LlmClient } from '@lume/ai';
import { env } from '../env.js';
import { logger } from './logger.js';
import { createMockLlmClient } from './dev-mock-llm.js';

let client: LlmClient | null = null;

export function getLlmClient(): LlmClient {
  if (!client) {
    if (env.USE_MOCK_LLM) {
      logger.warn('LLM client: USING MOCK (no Anthropic calls will be made)');
      client = createMockLlmClient();
    } else {
      client = new AnthropicLlmClient({ apiKey: env.ANTHROPIC_API_KEY });
    }
  }
  return client;
}

export function setLlmClientForTest(c: LlmClient | null): void {
  client = c;
}
