import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
} from '@react-email/components';
import type { ReactNode, CSSProperties } from 'react';
import { C, FONT_SANS } from './tokens.js';

type EmailLayoutProps = {
  children: ReactNode;
  accountUrl: string;
};

export function EmailLayout({ children, accountUrl }: EmailLayoutProps) {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body style={{ backgroundColor: C.bg, margin: '0', padding: '0', fontFamily: FONT_SANS }}>
        <Container style={{ maxWidth: '560px', margin: '0 auto', padding: '24px 16px 40px' }}>
          <Section
            style={{
              backgroundColor: C.surface,
              borderRadius: '10px',
              border: `1px solid ${C.border}`,
            }}
          >
            <Section style={{ padding: '36px 32px 28px' }}>
              <EmailWordmark />
              {children}
            </Section>
            <EmailFooter accountUrl={accountUrl} />
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function EmailWordmark() {
  return (
    <Text style={wordmarkStyle}>
      lume
      <span
        style={{
          display: 'inline-block',
          width: '9px',
          height: '4px',
          backgroundColor: C.accent,
          borderRadius: '1px',
          marginLeft: '2px',
          verticalAlign: 'middle',
        }}
      >
        {' '}
      </span>
    </Text>
  );
}

export function EmailFooter({ accountUrl }: { accountUrl: string }) {
  const linkStyle: CSSProperties = {
    color: C.ink2,
    textDecoration: 'none',
    borderBottom: `1px solid ${C.border}`,
  };
  return (
    <Section
      style={{
        padding: '16px 32px',
        backgroundColor: C.bg,
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <Text style={footerTextStyle}>
        feito por{' '}
        <Link href="https://instagram.com/adrian.campana" style={linkStyle}>
          @adrian.campana
        </Link>
        {' · '}
        <Link href="https://instagram.com/adrian.campana" style={linkStyle}>
          instagram
        </Link>
        {' · '}
        <Link href={accountUrl} style={linkStyle}>
          cancelar emails
        </Link>
      </Text>
    </Section>
  );
}

const wordmarkStyle: CSSProperties = {
  fontFamily: FONT_SANS,
  fontWeight: 600,
  fontSize: '18px',
  letterSpacing: '-0.04em',
  color: C.ink,
  margin: '0 0 28px',
  lineHeight: '1',
};

const footerTextStyle: CSSProperties = {
  fontFamily: FONT_SANS,
  fontSize: '11px',
  color: C.ink3,
  letterSpacing: '-0.005em',
  margin: '0',
  lineHeight: '1.6',
};
