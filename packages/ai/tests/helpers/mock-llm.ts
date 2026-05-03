import { MockLlmClient } from '../../src/llm/mock.js';

export function buildMock(): MockLlmClient {
  return new MockLlmClient();
}
