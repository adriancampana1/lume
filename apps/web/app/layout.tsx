import type { Metadata } from 'next';
import { geist, geistMono } from './fonts';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lume — A clareza que faltava nas suas contas do mês',
  description:
    'Suba seu extrato e receba um diagnóstico mensal financeiro claro, sem jargão. Seus dados são processados e descartados em segundos.',
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${geistMono.variable}`}>
      <body>
        <Script
            src="https://analytics.adriancampana.cloud/script.js"
            data-website-id="85510707-c9be-4dba-9a5e-27a5f0cb8b32"
            strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
