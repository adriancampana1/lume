import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from './env.js';
import { logger as appLogger } from './lib/logger.js';
import { authRoute } from './routes/auth.js';
import { healthRoute } from './routes/health.js';
import { dbCheckRoute } from './routes/db-check.js';
import { sessionsRoute } from './routes/sessions.js';
import { onboardingRoute } from './routes/onboarding.js';
import { meRoute } from './routes/me.js';
import { reportsRoute } from './routes/reports.js';
import { startCrons } from './crons/index.js';
import { rateLimit } from './middleware/rate-limit.js';
import { securityHeaders } from './middleware/security-headers.js';
import { serverTiming } from './middleware/server-timing.js';
import { pathToFileURL } from 'node:url';
import type { Variables } from './types.js';

export const app = new Hono<{ Variables: Variables }>();

app.use('*', cors({
  origin: env.PUBLIC_BASE_URL,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use('*', securityHeaders());
app.use('*', serverTiming());
app.use('*', rateLimit(60, 60_000));
app.use('/sessions/upload', rateLimit(20, 60_000));

app.route('/health', healthRoute);
app.route('/db-check', dbCheckRoute);
app.route('/auth', authRoute);
app.route('/sessions', sessionsRoute);
app.route('/onboarding', onboardingRoute);
app.route('/me', meRoute);
app.route('/reports', reportsRoute);


if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  serve({ fetch: app.fetch, port: env.PORT }, (info) => {
    appLogger.info({ port: info.port }, 'api ready');
    startCrons();
  });
}

/**
 *
 *
 *
 *
 * -- PRÓXIMAS ALTERAÇÕES --
 *
 * RELATÓRIO:
 * - [x] REMOVER TEXTO "sem ruído, sem julgamento" DA CAPA DO RELATÓRIO
 * - [x] AJUSTAR SEGUNDA PÁGINA DO RELATÓRIO, OS VALORES ESTÃO QUEBRANDO POR CONTA DA FALTA DE ESPAÇO NO WIDTH
 *      ENQUANTO O HEIGHT SOBRA ESPAÇO EM MAIS DA METADE DA PÁGINA EM BRANCO. AJUSTAR PARA FICAR MAIS AGRADÁVEL VISUALMENTE
 *
 * EMAIL:
 * - [ ] AJUSTAR TEMPLATE DE EMAIL PARA FICAR MAIS AGRADÁVEL VISUALMENTE
 *
 * SITE:
 * - [ ] CORRIGIR GERAÇÃO DO RELATÓRIO USANDO API REAL, ATUALMENTE ESTÁ MOCKADO
 * - [ ] ADICIONAR CURSOR POINTER NOS BOTÕES
 * - [ ] TESTAR FLUXO COMPLETO E CORRIGIR PROBLEMAS DE USABILIDADE E BUGS
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */