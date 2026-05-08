import { describe, expect, it, vi, beforeEach } from 'vitest';
import { sendReportEmail, sendQueuedEmail } from '../src/lib/email.js';

const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }));

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send: sendMock } })),
}));

describe('sendReportEmail', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it('sends email with react component and PDF attachment', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email-123' }, error: null });

    const pdf = Buffer.from('%PDF-fake');
    await sendReportEmail({
      to: 'user@test.lume',
      pdf,
      period: 'Abril de 2026',
      reportId: 'r-1',
    });

    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0]![0];
    expect(arg.to).toEqual(['user@test.lume']);
    expect(arg.subject).toContain('Lume');
    expect(arg.react).toBeDefined();
    expect(arg.attachments?.[0]?.filename).toMatch(/\.pdf$/);
  });

  it('throws when resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'rate_limit' } });
    await expect(
      sendReportEmail({
        to: 'a@b.c',
        pdf: Buffer.from('%PDF'),
        period: 'X',
        reportId: 'r',
      }),
    ).rejects.toThrow(/rate_limit/);
  });
});

describe('sendQueuedEmail', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it('sends queued email with react component', async () => {
    sendMock.mockResolvedValue({ data: { id: 'email-456' }, error: null });

    await sendQueuedEmail({ to: 'user@test.lume' });

    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0]![0];
    expect(arg.to).toEqual(['user@test.lume']);
    expect(arg.subject).toContain('Lume');
    expect(arg.react).toBeDefined();
  });

  it('throws when resend returns an error', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'quota_exceeded' } });
    await expect(sendQueuedEmail({ to: 'a@b.c' })).rejects.toThrow(/quota_exceeded/);
  });
});
