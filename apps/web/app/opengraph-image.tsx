import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Lume — A clareza que faltava nas suas contas do mês';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#fafafa',
          color: '#1a1f24',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 84px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
          letterSpacing: '-0.04em',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 56, fontWeight: 600 }}>
          <span>lume</span>
          <span style={{ width: 18, height: 8, background: '#bfeb52', display: 'inline-block' }} />
        </div>
        <div
          style={{
            fontSize: 96,
            lineHeight: 1.02,
            maxWidth: 980,
            fontWeight: 600,
            letterSpacing: '-0.045em',
          }}
        >
          A{' '}
          <span style={{ background: '#bfeb52', color: '#1f2a05', padding: '0 14px' }}>clareza</span>{' '}
          que faltava nas suas contas do mês.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, color: '#5a6470' }}>
          <span>Diagnóstico mensal financeiro</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>grátis</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>zero retention</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
