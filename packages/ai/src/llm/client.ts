export type LlmModel =
  | 'claude-sonnet-4-6'
  | 'claude-haiku-4-5-20251001';

export type LlmDocument = { kind: 'pdf'; data: Buffer; filename: string };
export type LlmTextPart = { kind: 'text'; text: string };
export type LlmInputPart = LlmDocument | LlmTextPart;

export type LlmCallOptions = {
  model: LlmModel;
  system: string;
  input: LlmInputPart[];
  maxTokens: number;
  temperature?: number;
  responseFormat?: 'text' | 'json';
};

export type LlmCallResult = {
  text: string;
  inputTokens: number;
  outputTokens: number;
};

export interface LlmClient {
  call(opts: LlmCallOptions): Promise<LlmCallResult>;
}
