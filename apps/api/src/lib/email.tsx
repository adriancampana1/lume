import { Resend } from 'resend';
import { env } from '../env.js';
import { ReportEmail } from '../emails/report-email.js';
import { QueuedEmail } from '../emails/queued-email.js';

const resend = new Resend(env.RESEND_API_KEY);

export type SendReportEmailInput = {
  to: string;
  pdf: Buffer;
  period: string;
  reportId: string;
};

export type SendQueuedEmailInput = {
  to: string;
};

export async function sendReportEmail(input: SendReportEmailInput): Promise<void> {
  const filename = `lume-${input.reportId.slice(0, 8)}.pdf`;
  const accountUrl = `${env.PUBLIC_BASE_URL}/conta`;

  const result = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [input.to],
    subject: `Seu relatório do mês está pronto · Lume`,
    react: <ReportEmail period={input.period} filename={filename} accountUrl={accountUrl} />,
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

export async function sendQueuedEmail(input: SendQueuedEmailInput): Promise<void> {
  const accountUrl = `${env.PUBLIC_BASE_URL}/conta`;

  const result = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [input.to],
    subject: `Recebemos seu pedido · Lume`,
    react: <QueuedEmail accountUrl={accountUrl} />,
  });

  if (result.error) {
    throw new Error(`resend error: ${result.error.message}`);
  }
}
