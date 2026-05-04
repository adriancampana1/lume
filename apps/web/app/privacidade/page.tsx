import { LegalShell } from '../components/legal/legal-shell.js';

export const metadata = { title: 'Privacidade · Lume' };

export default function PrivacyPage() {
  return (
    <LegalShell title="Como tratamos seus dados" updatedAt="01 de maio de 2026">
      <p>
        Lume é uma ferramenta gratuita que analisa extratos bancários e devolve um diagnóstico em PDF. Levamos privacidade a sério porque é literalmente o produto: se a gente não cuidar dos seus dados, ninguém usa, e a gente perde a graça.
      </p>

      <h2>O que processamos e onde</h2>
      <ul>
        <li>O conteúdo do seu extrato (PDF ou OFX) é mantido em memória do servidor durante o processamento (~30-90s) e em disco temporário (<code>/tmp</code>) com permissão restrita.</li>
        <li>Antes de qualquer chamada a um modelo de linguagem, descrições são anonimizadas: CPF, CNPJ, agência, conta, nome do titular, telefone, email e endereço são substituídos por placeholders. A cobertura é estatística (~95%) — declaramos isso honestamente.</li>
        <li>Ao final da geração, todos os arquivos do <code>/tmp</code> são apagados, mesmo em caso de erro.</li>
        <li>O PDF gerado é enviado por email e não fica armazenado no nosso servidor depois disso.</li>
      </ul>

      <h2>O que armazenamos</h2>
      <ul>
        <li>Seu email, nome e foto vindos do login Google.</li>
        <li>Sua faixa de renda (apenas se você optou por informar) — usada só para o comparativo POF/IBGE.</li>
        <li>Metadados dos relatórios (número de transações, tamanho do PDF, custo de processamento) — sem qualquer descrição ou valor de transação.</li>
        <li>Logs técnicos da aplicação por 14 dias, com filtro de PII automático.</li>
      </ul>

      <h2>Terceiros</h2>
      <ul>
        <li>
          <strong>Anthropic (Claude)</strong>: para extração e categorização. Eles podem reter dados por até 30 dias (mitigado pela anonimização).
        </li>
        <li>
          <strong>Resend</strong>: para entregar o PDF no seu email.
        </li>
        <li>
          <strong>Google</strong>: para o login OAuth (não recebe seu extrato).
        </li>
      </ul>

      <h2>Seus direitos LGPD</h2>
      <p>Você pode, a qualquer momento, em <a href="/conta">/conta</a>:</p>
      <ul>
        <li>Acessar e corrigir seus dados de perfil.</li>
        <li>Exportar tudo que temos sobre você em JSON.</li>
        <li>Deletar sua conta. Soft delete imediato + hard delete em 30 dias.</li>
        <li>Revogar opt-in de marketing.</li>
      </ul>

      <h2>Limites do que prometemos</h2>
      <p>
        Não prometemos perfeição. Prometemos minimização e transparência. Se algo der errado, comunicaremos a ANPD em 72h e os usuários afetados.
      </p>

      <h2>Encarregado (DPO)</h2>
      <p>
        O criador atua como DPO inicial. Contato: <a href="mailto:privacidade@lume.com.br">privacidade@lume.com.br</a>.
      </p>
    </LegalShell>
  );
}
