import { Resend } from 'resend';
import { env } from '../env.js';

const resend = new Resend(env.RESEND_API_KEY);

export type SendReportEmailInput = {
  to: string;
  pdf: Buffer;
  period: string;
  reportId: string;
};

export async function sendReportEmail(input: SendReportEmailInput): Promise<void> {
  const filename = `lume-${input.reportId.slice(0, 8)}.pdf`;

  const result = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [input.to],
    subject: `Seu relatório do mês está pronto · Lume`,
    text:
      `Oi,\n\n` +
      `Seu relatório financeiro de ${input.period} está em anexo.\n\n` +
      `Os arquivos originais que você enviou foram descartados ao final do processamento — ` +
      `como prometido, sem retenção.\n\n` +
      `Se quiser, baixe o PDF e guarde só na sua máquina. Não temos cópia.\n\n` +
      `— Lume`,
    attachments: [
      {
        filename,
        content: input.pdf.toString('base64'),
      },
    ],
  });

  if (result.error) {
    throw new Error(`resend error: ${result.error.message}`);
  }
}
