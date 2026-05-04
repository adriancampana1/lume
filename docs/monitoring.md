# Monitoring — Lume

## UptimeRobot
- Monitor type: HTTP(s)
- URL: `https://lume.com.br/api/health`
- Interval: 5min
- Alert: email do criador
- Keyword check: `"status":"ok"` (alerta se ausente)

## Logs
- VPS: `/var/log/lume/api.log`, `/var/log/lume/web.log`
- Rotação: logrotate diário, 14 dias

## Métricas-alvo (manual review)
- LCP landing < 1.2s
- TTFB < 200ms (Server-Timing header)
- RAM idle < 500MB, pico < 1.5GB
- Disponibilidade ≥ 99.5%

## Alarmes operacionais (humanos)
- 3 alertas seguidos UptimeRobot → entrar no servidor
- Logs com `slow request` repetidos → investigar query
- Logs com `pipeline_failed` > 5/h → investigar Anthropic + cota
