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
          background: '#ede4d3',
          color: '#2b1d12',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 84px',
          justifyContent: 'space-between',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: 72 }}>Lume</div>
        <div style={{ fontFamily: 'serif', fontStyle: 'italic', fontSize: 96, lineHeight: 1.05, maxWidth: 900 }}>
          A <span style={{ color: '#b3441e' }}>clareza</span> que faltava nas suas contas do mês.
        </div>
        <div style={{ fontSize: 28, color: '#5e4a35' }}>Diagnóstico mensal financeiro · grátis · zero retention</div>
      </div>
    ),
    { ...size },
  );
}
