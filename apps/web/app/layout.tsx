import type { Metadata } from 'next';
import { inter, instrumentSerif } from './fonts.js';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lume — A clareza que faltava nas suas contas do mês',
  description:
    'Suba seu extrato e receba um diagnóstico mensal financeiro claro, sem jargão. Seus dados são processados e descartados em segundos.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
