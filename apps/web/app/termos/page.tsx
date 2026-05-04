import { LegalShell } from '../components/legal/legal-shell.js';

export const metadata = { title: 'Termos de uso · Lume' };

export default function TermsPage() {
  return (
    <LegalShell title="Termos de uso" updatedAt="01 de maio de 2026">
      <h2>1. O que é o serviço</h2>
      <p>Lume é uma ferramenta web gratuita que recebe extratos bancários, processa via IA e retorna um relatório financeiro em PDF. É posicionada como ferramenta de informação financeira, sem aconselhamento profissional regulado.</p>

      <h2>2. Cadastro e cota</h2>
      <p>O acesso a geração de relatório requer login Google. Cada usuário pode gerar 1 relatório a cada 30 dias (rolling window). Cota global do dia pode ser atingida e novas execuções entram em fila.</p>

      <h2>3. Uso aceitável</h2>
      <ul>
        <li>Você só envia extratos seus.</li>
        <li>Você não tenta abusar (spam, scraping, bypass de cap).</li>
        <li>Não há garantias de uptime contínuo (alvo 99,5%).</li>
      </ul>

      <h2>4. Limites de responsabilidade</h2>
      <p>O relatório é gerado de forma automatizada. Embora aplicamos validação numérica, não substitui parecer contábil ou financeiro humano. Você decide sozinho como agir sobre os achados.</p>

      <h2>5. Mudanças</h2>
      <p>Esses termos podem mudar. A versão atual e a data são sempre as exibidas aqui.</p>

      <h2>6. Lei aplicável</h2>
      <p>Brasil. Foro de São Paulo, SP.</p>
    </LegalShell>
  );
}
