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
    this.sdk = new Anthropic({ apiKey: opts.apiKey });
  }

  async call(opts: LlmCallOptions): Promise<LlmCallResult> {
    const res = await this.sdk.messages.create({
      model: opts.model,
      max_tokens: opts.maxTokens,
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
      system: opts.system,
      messages: [{ role: 'user', content: toAnthropicContent(opts.input) }],
    });
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
