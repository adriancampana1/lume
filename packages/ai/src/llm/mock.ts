import type { LlmCallOptions, LlmCallResult, LlmClient } from './client.js';

export type MockResponse = (opts: LlmCallOptions) => string | Promise<string>;

export class MockLlmClient implements LlmClient {
  private readonly handlers: Map<string, MockResponse> = new Map();
  public readonly calls: LlmCallOptions[] = [];

  on(systemPrefix: string, handler: MockResponse): this {
    this.handlers.set(systemPrefix, handler);
    return this;
  }

  async call(opts: LlmCallOptions): Promise<LlmCallResult> {
    this.calls.push(opts);
    const matched = [...this.handlers.entries()].find(([prefix]) =>
      opts.system.startsWith(prefix),
    );
    if (!matched) {
      throw new Error(
        `MockLlmClient: no handler for system prompt prefix.\nGot: ${opts.system.slice(0, 80)}…`,
      );
    }
    const text = await matched[1](opts);
    return { text, inputTokens: 0, outputTokens: 0 };
  }
}
