export const copy = {
  brand: {
    name: 'Lume',
    headline: 'A clareza que faltava nas suas contas do mês.',
    tagline: 'Suba seu extrato. Receba um diagnóstico claro do mês.',
  },
  landing: {
    primaryCta: 'Gerar minha análise',
    secondaryCta: 'Ver como funciona',
    howItWorks: {
      title: 'Como funciona',
      steps: [
        {
          title: 'Suba até 6 extratos',
          body: 'PDF do app do seu banco ou OFX. Até 6 meses. Funciona com Itaú, Nubank, Inter, BB, Bradesco, Santander.',
        },
        {
          title: 'A gente lê e organiza',
          body: 'Categorizamos cada despesa, identificamos recorrências e validamos os totais antes de qualquer interpretação.',
        },
        {
          title: 'Você recebe o diagnóstico',
          body: 'PDF estruturado em 7 seções, no seu email. Tudo descartado em segundos depois.',
        },
      ],
    },
    whatShows: {
      title: 'O que vem no relatório',
      cards: [
        { title: 'Resumo do período', body: 'Totais e os 3 destaques do mês, em linguagem clara.' },
        { title: 'Para onde foi o dinheiro', body: 'Categorização mês a mês com gráfico horizontal.' },
        { title: 'Tendências', body: 'Crescimento e queda por categoria, padrões emergentes.' },
        {
          title: 'Recorrências',
          body: 'Assinaturas e cobranças repetidas, com sinal de aumento ou inatividade.',
        },
        {
          title: 'Comparativo da sua faixa',
          body: 'Como sua despesa se compara à média POF/IBGE da sua faixa de renda.',
        },
        { title: 'Recomendações', body: '3 a 5 ações concretas baseadas no que apareceu no extrato.' },
        { title: 'Próximos passos', body: 'Quando voltar e o que olhar até lá.' },
      ],
    },
    privacy: {
      title: 'Privacidade não é detalhe técnico — é o ponto.',
      microcards: [
        {
          title: 'Zero retention',
          body: 'Seu extrato fica em memória durante o processamento e é apagado em segundos. Nada armazenado.',
        },
        {
          title: 'Anonimização antes da IA',
          body: 'CPF, nome, agência, conta, telefone, endereço — tudo redigido antes de qualquer chamada externa.',
        },
        {
          title: 'PDF chega no seu email',
          body: 'Sem link permanente. O relatório vive no seu inbox, não no nosso servidor.',
        },
        {
          title: 'LGPD a sério',
          body: 'Você pode exportar ou apagar seu perfil a qualquer momento, sem fricção, sem email de retenção.',
        },
      ],
    },
    finalCta: 'Comece com um mês — pode ser o do banco que você já tem aberto.',
    footer: {
      links: [
        { label: 'Privacidade', href: '/privacidade' },
        { label: 'Termos', href: '/termos' },
        { label: 'Instagram do criador', href: 'https://instagram.com/' },
      ],
      tagline: 'Feito por uma pessoa só, em São Paulo.',
    },
  },
  upload: {
    title: 'Suba seus extratos',
    subhead: 'Até 6 PDFs ou OFXs, 10MB cada. 1 mês ou até 6 meses comparados.',
    dropzone: {
      hint: 'Arraste seus extratos aqui',
      cta: 'ou clique para escolher',
    },
    bankInstructionsTitle: 'Como exportar PDF do seu banco',
    cta: 'Gerar análise',
    legal:
      'Ao continuar, você concorda em fazer login com Google só para autorizar a geração. Seus dados financeiros nunca são associados a esse login no nosso lado.',
  },
  onboarding: {
    title: 'Uma única pergunta antes do relatório.',
    question: 'Qual sua faixa de renda mensal?',
    helper: 'Usado apenas para comparar com a média da sua faixa. Você pode mudar depois.',
    options: [
      { value: 'up_to_3k', label: 'Até R$ 3 mil' },
      { value: 'from_3k_to_6k', label: 'R$ 3 mil a R$ 6 mil' },
      { value: 'from_6k_to_12k', label: 'R$ 6 mil a R$ 12 mil' },
      { value: 'from_12k_to_25k', label: 'R$ 12 mil a R$ 25 mil' },
      { value: 'above_25k', label: 'Acima de R$ 25 mil' },
      { value: 'prefer_not_to_say', label: 'Prefiro não responder' },
    ],
    cta: 'Continuar',
  },
  processing: {
    title: 'Processando seu mês',
    helper: 'Não feche esta aba. Pode levar de 30s a 1min e meio.',
    stages: {
      extracting: 'Extraindo transações dos seus extratos…',
      anonymizing: 'Anonimizando seus dados…',
      reconciling: 'Validando totais…',
      categorizing: 'Categorizando despesas…',
      aggregating: 'Identificando padrões e recorrências…',
      narrating: 'Comparando com sua faixa e gerando relatório…',
    } as const,
  },
  result: {
    title: 'Seu relatório está pronto.',
    download: 'Baixar PDF',
    sentTo: (email: string) => `Também enviamos por email para ${email}.`,
    shareTitle: 'Achou útil? Pode ajudar alguém.',
    copyLink: 'Copiar link',
    copied: 'Link copiado',
    marketing: {
      label: 'Quero receber por email quando uma nova ferramenta sair.',
      helper: 'Sem spam. Sem indicação de produto pago. Só o que vem a seguir.',
    },
    follow: {
      title: 'O criador conta o processo no Instagram.',
      cta: 'Seguir no Instagram',
    },
  },
  cap: {
    title: 'Você já gerou sua análise dessa janela.',
    body: 'Esta ferramenta tem custo de processamento por análise — o limite existe pra que ela continue gratuita pra todo mundo.',
    next: (days: number) => `Sua próxima análise estará disponível em ${days} ${days === 1 ? 'dia' : 'dias'}.`,
    marketing: 'Quero receber por email quando uma nova ferramenta for lançada',
    follow: 'Seguir no Instagram',
  },
  notFound: {
    title: 'Não encontramos esta página.',
    cta: 'Voltar pra home',
  },
  error: {
    title: 'Algo travou no caminho.',
    body: 'Tentamos uma vez e não rolou. Você pode tentar de novo — sua cota não foi consumida.',
    cta: 'Tentar novamente',
  },
} as const;

export type Copy = typeof copy;
