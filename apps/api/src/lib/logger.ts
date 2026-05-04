import pino from 'pino';
import { redactValue } from './pii-redact.js';

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.cpf',
      '*.email',
    ],
    censor: '[REDACTED]',
  },
  formatters: {
    log(obj) {
      return redactValue(obj) as Record<string, unknown>;
    },
  },
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'HH:MM:ss', ignore: 'pid,hostname' },
    },
  }),
});

export type Logger = typeof logger;
