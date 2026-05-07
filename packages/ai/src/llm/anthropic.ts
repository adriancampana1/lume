import Anthropic from '@anthropic-ai/sdk';
import type {
  LlmCallOptions,
  LlmCallResult,
  LlmClient,
  LlmInputPart,
} from './client.js';

export type AnthropicLlmClientOptions = {
  apiKey: string;
};

function toAnthropicContent(parts: LlmInputPart[]): Anthropic.MessageParam['content'] {
  return parts.map((p) => {
    if (p.kind === 'text') return { type: 'text', text: p.text };
    return {
      type: 'document',
      source: {
        type: 'base64',
        media_type: 'application/pdf',
        data: p.data.toString('base64'),
      },
      cache_control: { type: 'ephemeral' },
    } as Anthropic.DocumentBlockParam;
  });
}

export class AnthropicLlmClient implements LlmClient {
  private readonly sdk: Anthropic;

  constructor(opts: AnthropicLlmClientOptions) {
    this.sdk = new Anthropic({ apiKey: opts.apiKey, timeout: 90_000, maxRetries: 1 });
  }

  async call(opts: LlmCallOptions): Promise<LlmCallResult> {
    const startedAt = Date.now();
    const promptTag = opts.system.slice(0, 40).replace(/\s+/g, ' ');
    console.info('[anthropic] call start', { model: opts.model, prompt: promptTag });
    let res;
    try {
      res = await this.sdk.messages.create({
        model: opts.model,
        max_tokens: opts.maxTokens,
        ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
        system: [{ type: 'text', text: opts.system, cache_control: { type: 'ephemeral' } }],
        messages: [{ role: 'user', content: toAnthropicContent(opts.input) }],
      });
    } catch (err) {
      console.error('[anthropic] call failed', {
        model: opts.model,
        prompt: promptTag,
        durationMs: Date.now() - startedAt,
        error: (err as Error).message,
      });
      throw err;
    }
    console.info('[anthropic] call ok', {
      model: opts.model,
      prompt: promptTag,
      durationMs: Date.now() - startedAt,
      inputTokens: res.usage.input_tokens,
      outputTokens: res.usage.output_tokens,
    });
    if (res.usage.cache_read_input_tokens) {
      console.debug('[anthropic] prompt cache hit', {
        cacheRead: res.usage.cache_read_input_tokens,
        cacheCreated: res.usage.cache_creation_input_tokens,
      });
    }
    const text = res.content
      .filter((c): c is Anthropic.TextBlock => c.type === 'text')
      .map((c) => c.text)
      .join('\n');
    return {
      text,
      inputTokens: res.usage.input_tokens,
      outputTokens: res.usage.output_tokens,
    };
  }
}
