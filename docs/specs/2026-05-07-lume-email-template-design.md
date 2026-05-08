# Lume — Email Templates com Identidade Visual

**Data:** 2026-05-07
**Status:** aprovado pelo usuário
**Escopo:** `apps/api/src/lib/email.ts` — `sendReportEmail` + `sendQueuedEmail`

---

## 1. Decisão técnica

**react-email** (`@react-email/components` + `@react-email/render`) para ambos os templates.

Rationale:
- Stack já usa React (`packages/pdf`)
- Resend aceita `react:` diretamente em `emails.send()`
- Tokens viram constantes TS compartilhadas (`email-tokens.ts`)
- Type-safe, componentes reutilizáveis entre os dois templates
- CSS inline automático (cross-client compat)

Não usamos: raw HTML string, mjml, arquivos .html estáticos.

---

## 2. Identidade visual aplicada ao email

Design reference: `DESIGN.md` (direção Mono + Lime · Geist, 2026-05-05).

### 2.1 Paleta (OKLCH → hex para email clients)

| Token         | OKLCH                        | Hex email   | Uso                          |
|---------------|------------------------------|-------------|------------------------------|
| `--bg`        | oklch(0.985 0.003 220)       | `#f9f9fb`   | fundo externo, footer        |
| `--surface`   | oklch(1.000 0.001 220)       | `#ffffff`   | body do email                |
| `--ink`       | oklch(0.140 0.008 220)       | `#171820`   | heading, texto forte         |
| `--ink-2`     | oklch(0.420 0.006 220)       | `#636470`   | corpo do texto               |
| `--ink-3`     | oklch(0.600 0.005 220)       | `#8c8e98`   | eyebrow, footer, captions    |
| `--accent`    | oklch(0.860 0.210 130)       | `#bfea35`   | lime — badge PDF, status dot |
| `--accent-deep`| oklch(0.300 0.090 130)      | `#2d4a09`   | texto em superfície lime     |
| `--border`    | oklch(0.920 0.005 220)       | `#e7e8ee`   | bordas, separadores          |

Lime aparece em <10% de qualquer frame — badge PDF e status dot apenas.

### 2.2 Tipografia

Geist não tem suporte confiável via `@font-face` em email clients corporativos (Gmail strips external fonts). Fallback stack:

```
font-family: 'Geist', ui-sans-serif, -apple-system, BlinkMacSystemFont,
             'Segoe UI', Helvetica, Arial, sans-serif;
```

- Heading: 22px, weight 600, letter-spacing -0.035em, line-height 1.15
- Body: 14px, weight 400, letter-spacing -0.010em, line-height 1.6
- Eyebrow: 10px, weight 500, letter-spacing 0.10em, uppercase
- Mono (attachment pill, status): `'Geist Mono', 'Courier New', monospace`, 12px

### 2.3 Wordmark

`lume` Geist 600, letter-spacing -0.04em, cor `#171820`.
Lime rect: `9×4px`, `#bfea35`, border-radius 1px, margin-left 2px, vertical-align baseline.

Em email (sem animação): rect estático, sem blink. A marca é reconhecível mesmo sem animação.

---

## 3. Componentes compartilhados

### `EmailLayout`
Wrapper de todos os emails. Estrutura:

```
<Html lang="pt-BR">
  <Head /> (meta charset, preconnect Geist)
  <Body bg="#f9f9fb">
    <Container maxWidth="560px" margin="0 auto" padding="24px 16px">
      <Section bg="#ffffff" borderRadius="10px" border="1px solid #e7e8ee">
        <Section padding="36px 32px 28px"> {/* body */} </Section>
        <Section padding="16px 32px" bg="#f9f9fb" borderTop="1px solid #e7e8ee">
          {/* footer */}
        </Section>
      </Section>
    </Container>
  </Body>
</Html>
```

### `EmailWordmark`
```tsx
<Text style={{ fontFamily: FONT_SANS, fontWeight: 600, fontSize: '18px',
               letterSpacing: '-0.04em', color: '#171820', margin: '0 0 28px' }}>
  lume
  <span style={{ display: 'inline-block', width: '9px', height: '4px',
                 background: '#bfea35', borderRadius: '1px', marginLeft: '2px',
                 verticalAlign: 'baseline', position: 'relative', top: '1px' }} />
</Text>
```

### `EmailFooter`
```tsx
<Text style={{ fontSize: '11px', color: '#8c8e98', letterSpacing: '-0.005em' }}>
  feito por{' '}
  <Link href="https://instagram.com/adrian.campana">@adrian.campana</Link>
  {' · '}
  <Link href="https://instagram.com/adrian.campana">instagram</Link>
  {' · '}
  <Link href={accountUrl}>cancelar emails</Link>
</Text>
```

`accountUrl` = `${PUBLIC_BASE_URL}/conta` — página de preferências do usuário.
MVP não tem endpoint de unsubscribe dedicado; o link aponta para `/conta` onde o toggle de opt-in marketing existe. Emails transacionais (relatório, fila) não têm unsubscribe obrigatório (são disparados por ação do próprio usuário), mas o link de /conta é boa prática e cobre o caso de marketing opt-in futuro.

---

## 4. Email 1 — `ReportEmail` (substitui `sendReportEmail`)

**Subject:** `Seu relatório do mês está pronto · Lume`

**Estrutura do body:**

```
[Wordmark]

[Eyebrow]   MMMM · YYYY                          ← período do relatório
[Heading]   Seu relatório                         ← H1 22px, ink
            está pronto.
[Para 1]    Em anexo está o PDF com sua análise financeira de [período].
[Para 2]    Os arquivos que você enviou foram descartados ao final
            do processamento — como prometido.
[Divider]   1px #e7e8ee
[Attachment pill]   [PDF badge lime] lume-[id8].pdf

[Footer]
```

**`SendReportEmailInput`** mantém: `{ to: string; pdf: Buffer; period: string; reportId: string }`.
**`SendQueuedEmailInput`**: `{ to: string }` — sem dados de período ou relatório (pedido ainda não processou).

Período (ex: "Abril de 2026") vira eyebrow em uppercase: "ABRIL · 2026".

Attachment pill (inline-block):
- Background `#f9f9fb`, border `1px solid #e7e8ee`, border-radius 8px, padding `9px 13px`
- Badge: `28×20px`, `#bfea35` bg, `#2d4a09` text, `PDF`, Geist 8px 600, border-radius 4px

---

## 5. Email 2 — `QueuedEmail` (substitui `sendQueuedEmail`)

**Subject:** `Recebemos seu pedido · Lume`

**Estrutura do body:**

```
[Wordmark]

[Eyebrow]   ANÁLISE EM FILA
[Heading]   Recebemos
            seu pedido.
[Para 1]    Hoje atingimos o limite de processamentos do dia —
            sem ação da sua parte, seu relatório chega por aqui
            assim que processar.
[Para 2]    Esse limite existe pra que a ferramenta continue
            gratuita pra todo mundo.
[Status pill]  ● na fila · previsão: algumas horas

[Footer]
```

Status pill (inline-block):
- Background `#f9f9fb`, border `1px solid #e7e8ee`, border-radius 8px, padding `10px 12px`
- Dot: `6×6px`, `#bfea35`, border-radius 50%
- Text: Geist Mono 12px 500, `#636470`

Sem ETA numérico — não compromete horário incerto.

---

## 6. Estrutura de arquivos criados

```
apps/api/src/lib/
├── email.ts           (modify — substituir implementações por react-email)
└── email-tokens.ts    (create — constantes de tokens para email)

packages/                  (ou apps/api/src/emails/)
└── emails/
    ├── layout.tsx          (create — EmailLayout + EmailWordmark + EmailFooter)
    ├── report-email.tsx    (create — ReportEmail component)
    └── queued-email.tsx    (create — QueuedEmail component)
```

Localização preferida: `apps/api/src/emails/` (co-located com a API, sem novo pacote).

---

## 7. Dependências

```json
"@react-email/components": "^0.0.33",
"@react-email/render": "^1.0.5"
```

Adicionar em `apps/api/package.json`. Verificar versão mais recente em npmjs.com antes de instalar.

---

## 8. Compatibilidade de email clients

react-email inlina CSS automaticamente. Pontos de atenção:

- `border-radius` em `<table>` cai no Outlook Desktop → aceitável (graceful degradation)
- `inline-block` em attachment pill pode virar block em Outlook → usar `<table>` interno
- Fonts externas (Geist) não carregam no Gmail → fallback stack define aparência
- Cores OKLCH não suportadas → hex definidos na §2.1 são os valores canônicos

---

## 9. Testes

- Teste unitário de `sendReportEmail` (mock Resend) mantido como está (`email.test.ts`)
- Validar que `sendMock.calls[0][0].react` existe (não `.html`/`.text`)
- Preview local via `react-email dev` (opcional, não obrigatório para CI)

---

## 10. Fora do escopo

- Dark mode no email (Lume ainda não tem dark mode no MVP)
- Email de marketing (opt-in) — template separado, fora deste plano
- Link permanente para download do PDF — viola zero retention
- Preview do PDF como imagem no email — complexidade sem valor proporcional
