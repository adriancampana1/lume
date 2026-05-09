import { StatementSchema, type Statement } from './types.js';
import type { LlmClient } from './llm/client.js';
import { EXTRACT_SYSTEM, EXTRACT_USER } from './prompts.js';
import { PDFParse } from 'pdf-parse';

export type ExtractInput = {
  llm: LlmClient;
  pdf: Buffer;
  filename: string;
  economyMode?: boolean;
};

function stripFences(s: string): string {
  return s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

export async function extractStatementFromPdf(input: ExtractInput): Promise<Statement> {
  const economy = input.economyMode ?? false;
  
  // Extrai o texto do PDF localmente em vez de mandar o binário inteiro
  const parser = new PDFParse({ data: input.pdf });
  try {
    const textResult = await parser.getText();
    const extractedText = textResult.text;

    const result = await input.llm.call({
      model: economy ? 'claude-haiku-4-5-20251001' : 'claude-sonnet-4-6',
      system: EXTRACT_SYSTEM,
      maxTokens: 8000, // Aumentado para 8000 para evitar truncamento do JSON
      temperature: 0,
      input: [
        { 
          kind: 'text', 
          text: `Arquivo original: ${input.filename}\n\nTexto do PDF:\n${extractedText}`
        },
        { kind: 'text', text: EXTRACT_USER },
      ],
    });

    const cleaned = stripFences(result.text);
    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.declaredTotalDebitsCents === 'number') {
          parsed.declaredTotalDebitsCents = Math.abs(parsed.declaredTotalDebitsCents);
        }
        if (typeof parsed.declaredTotalCreditsCents === 'number') {
          parsed.declaredTotalCreditsCents = Math.abs(parsed.declaredTotalCreditsCents);
        }
      }
    } catch (err) {
      throw new Error(`extract: invalid JSON from LLM: ${(err as Error).message}`);
    }
    return StatementSchema.parse(parsed);
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`extract: Falha ao ler PDF: ${err.message}`);
    }
    throw err;
  }
}
