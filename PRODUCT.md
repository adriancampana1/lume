# Product

## Register

product

## Users

Pessoas físicas brasileiras com extrato bancário (PDF ou OFX). Aquisição inicial via Instagram do criador (Adrian) — audiência primária empresários e executivos, mas o produto serve qualquer pessoa com conta bancária.

Contexto de uso: sessão única, mobile-first, 30 a 90 segundos de espera entre upload e PDF gerado. Maioria acessa do celular, sem instalar nada, sem cadastro complexo, sem pagar.

Job-to-be-done: ter clareza concreta sobre para onde foi o dinheiro do mês — categorização, recorrências, comparativo com a faixa de renda — em formato que dá pra guardar (PDF) sem deixar dado financeiro num servidor de terceiro.

## Product Purpose

Web app gratuito que recebe 1 a 6 extratos bancários, analisa via IA com pipeline anti-alucinação (reconciliação numérica, anonimização pré-LLM, prompts rígidos), e devolve relatório mensal financeiro em PDF.

Posicionamento: lead magnet do criador para construção de autoridade no Instagram e captura de email opt-in. Princípio fundador: gerar valor real ao usuário sem mecânicas de growth-hacking, sem condicionar valor a ações de favor ao criador.

Vibe comunitária: ferramenta gratuita pra todo mundo testar. Tech-aware: automação, IA, finanças pessoais como tema de fundo. Sucesso = usuário sai com diagnóstico útil + opt-in marketing voluntário (meta 25-35%).

## Brand Personality

**Moderno · Útil · Silencioso.**

Voz calma, clara, próxima. Sem jargão financeiro. Sem hype. Sem julgamento. Honestidade transversal — incluindo limites do que o produto faz e não faz, custo de processamento, modos de falha. Profissionalismo silencioso: não grita, não vende, não persuade — entrega.

## Anti-references

- PicPay literal (verde-fluo card-saldo bottom-tab). Inspira estrutura clean, não estética.
- Tipografias serif (Instrument Serif, Fraunces, Source Serif, Newsreader). Fora.
- Fontes "AI-default" do Claude (Söhne-Linear-clone genérico, system-ui sem identidade).
- Hero-metric template: big-number + small-label + supporting-stats + gradient-accent.
- Side-stripe borders coloridos em cards.
- Gradient text (background-clip text).
- Glassmorphism decorativo.
- Card-grids idênticos: icon + heading + text repetidos.
- Ilustrações Storyset / Lottie / undraw genéricas.
- Clichês fintech BR: roxo Nubank, amarelo Mercado Pago, preto-dourado BTG, laranja Itaú.
- Wrapped, arquétipo, personality-reveal financeiro, score gamificado.
- Modal pop-up agressivo, "convide 3 amigos pra desbloquear".

## Design Principles

1. **Valor antes de captura.** Toda superfície passa o crivo *"isso entrega valor real ao usuário, sem parecer que estou querendo algo em troca?"*. Opt-in marketing, IG, copiar-link existem como consequência discreta, nunca pré-requisito.

2. **Honestidade transversal.** Limites técnicos, custo de processamento, modos de falha, riscos de IA, política de retenção comunicados explicitamente na interface — não escondidos no footer. Privacidade tem seção dedicada.

3. **Silêncio é luxo.** Espaçamento generoso, hierarquia por escala e peso (não por cor), paleta restrita, motion ease-out-expo sem bounce. Nada grita. Vazio é decisão, não acidente.

4. **Único, feito-à-mão.** Detalhes que delatam mão humana: kerning manual em wordmark, micro-animações sob medida, curva de cor própria, ilustrações custom (nunca stock). Cada superfície passa no teste *"alguém poderia dizer com certeza que IA fez isso?"* — se sim, refazer.

5. **Mobile-primeiro, igualmente bonito em qualquer tela.** Layouts respiram em desktop sem virar landing-page-de-SaaS cliché. 320px funciona. 1440px floresce. Nada entre os dois quebra.

## Accessibility & Inclusion

- WCAG 2.2 AA como piso, não teto.
- Respeitar `prefers-reduced-motion`: substitui transições espaciais por fades curtos (≤120ms) ou nenhum movimento.
- Respeitar `prefers-color-scheme` quando relevante; tema light é default mas dark mode entra em v1.5.
- Contraste mínimo 4.5:1 em texto corrido, 3:1 em UI components e texto grande (≥18pt).
- Foco visível custom (anel sólido offset 2px na cor primária, nunca outline default cinza).
- Hit targets ≥44×44px no mobile.
- Hierarquia semântica HTML: headings sequenciais, landmarks (`main`, `nav`, `footer`), formulários com `<label>` associado.
- Alt-text descritivo em ilustrações e ícones funcionais; ícones decorativos com `aria-hidden`.
- Testar com leitor de tela (NVDA/VoiceOver) nos fluxos críticos: upload → onboarding → processamento → resultado.
- Copy em PT-BR claro, frases curtas, voz ativa.
