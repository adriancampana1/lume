import { Section, Text } from '@react-email/components';
import type { CSSProperties } from 'react';
import { EmailLayout } from './layout.js';
import { C, FONT_SANS, FONT_MONO } from './tokens.js';

export type QueuedEmailProps = {
  accountUrl: string;
};

export function QueuedEmail({ accountUrl }: QueuedEmailProps) {
  return (
    <EmailLayout accountUrl={accountUrl}>
      <Text style={eyebrowStyle}>ANÁLISE EM FILA</Text>

      <Text style={headingStyle}>
        Recebemos
        <br />
        seu pedido.
      </Text>

      <Text style={bodyStyle}>
        Hoje atingimos o limite de processamentos do dia —{' '}
        <strong style={{ color: C.ink, fontWeight: 500 }}>sem ação da sua parte</strong>,
        {' '}seu relatório chega por aqui assim que processar.
      </Text>

      <Text style={{ ...bodyStyle, marginBottom: '0' }}>
        Esse limite existe pra que a ferramenta continue gratuita pra todo mundo.
      </Text>

      <Section
        style={{
          backgroundColor: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          padding: '10px 12px',
          marginTop: '18px',
          maxWidth: '240px',
        }}
      >
        <Text style={{ margin: '0', fontFamily: FONT_MONO, fontSize: '12px', fontWeight: 500, color: C.ink2, letterSpacing: '-0.005em', lineHeight: '1' }}>
          <span
            style={{
              display: 'inline-block',
              width: '6px',
              height: '6px',
              backgroundColor: C.accent,
              borderRadius: '50%',
              marginRight: '8px',
              verticalAlign: 'middle',
            }}
          >
            {' '}
          </span>
          na fila · previsão: algumas horas
        </Text>
      </Section>
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
