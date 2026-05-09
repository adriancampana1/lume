import { Text } from '@react-email/components';
import type { CSSProperties } from 'react';
import { EmailLayout } from './layout.js';
import { C, FONT_SANS } from './tokens.js';

export type ReportEmailProps = {
  period: string;
  accountUrl: string;
};

export function ReportEmail({ period, accountUrl }: ReportEmailProps) {
  const eyebrow = period.replace(/\s+de\s+/i, ' · ').toUpperCase();

  return (
    <EmailLayout accountUrl={accountUrl}>
      <Text style={eyebrowStyle}>{eyebrow}</Text>

      <Text style={headingStyle}>
        Seu relatório
        <br />
        está pronto.
      </Text>

      <Text style={bodyStyle}>
        Em anexo está o PDF com sua análise financeira de{' '}
        <strong style={{ color: C.ink, fontWeight: 500 }}>{period.toLowerCase()}</strong>.
      </Text>

      <Text style={{ ...bodyStyle, marginBottom: '0' }}>
        Os arquivos que você enviou foram descartados ao final do processamento — como prometido.
      </Text>
    </EmailLayout>
  );
}

const eyebrowStyle: CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.10em',
  textTransform: 'uppercase',
  color: C.ink3,
  margin: '0 0 10px',
};

const headingStyle: CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '22px',
  fontWeight: 600,
  letterSpacing: '-0.035em',
  color: C.ink,
  lineHeight: '1.15',
  margin: '0 0 18px',
};

const bodyStyle: CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '14px',
  color: C.ink2,
  lineHeight: '1.6',
  letterSpacing: '-0.010em',
  margin: '0 0 10px',
};
