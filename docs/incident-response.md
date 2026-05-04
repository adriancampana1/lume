# Plano de resposta a incidente — Lume

> Autor: criador (DPO inicial). Última revisão: 2026-05-01.

## Princípios
- Conter rápido, comunicar honestamente, aprender publicamente.
- Em dúvida sobre dado pessoal vazado → notificar ANPD em até 72h.

## 1. Detectar
Sinais que disparam o plano:
- UptimeRobot derrubou status ≥ 5 min
- Usuário relata vazamento ou anomalia (formulário ou DM IG)
- Logs `pipeline_failed` > 5/hora
- pnpm audit aponta CVE Critical em deps em produção

## 2. Conter (T+0 a T+30min)
- Pausar uploads: subir um banner "Em manutenção" via env `MAINTENANCE_MODE=1` que faz `/sessions/upload` retornar 503.
- Pausar pipeline: `/reports/generate*` retornam 503.
- Manter site read-only (landing + `/conta`).

## 3. Erradicar (T+30min a T+horas)
- Identificar root cause: logs, banco, infra.
- Aplicar fix em branch `hotfix/*`.
- Rodar `pnpm test` + smoke E2E manual antes de subir.

## 4. Recuperar
- Reativar uploads e pipeline.
- Limpar fila se necessário.
- Comunicar status no IG ("voltamos").

## 5. Comunicar
- **ANPD**: form em https://www.gov.br/anpd/. Em até **72h** se houve dado pessoal vazado.
- **Usuários afetados**: email transacional.
- **Público**: post no IG + writeup no site.

## 6. Aprender
- Postmortem em 7 dias.
- Adicionar item à lista de risk register e à CI.

## Contatos
- DPO (criador): privacidade@lume.com.br
- Hospedagem (Hostinger): suporte do painel
- Anthropic: privacy@anthropic.com
- Resend: support@resend.com

## Pré-requisitos para "estar pronto"
- ✅ /health monitor (Task 12)
- ✅ logs não-PII (Task 1)
- ✅ audit log (Task 8)
- ✅ env `MAINTENANCE_MODE` lido em `/sessions/upload` e `/reports/*`
