import { describe, expect, it } from 'vitest';
import { parseEnv } from '../src/env.js';

describe('parseEnv', () => {
  it('parses a complete valid env', () => {
    const env = parseEnv({
      NODE_ENV: 'development',
      PORT: '3001',
      DATABASE_URL: 'postgres://lume:lume@localhost:5432/lume',
      AUTH_SECRET: 'a'.repeat(48),
      AUTH_URL: 'http://localhost:3001',
      GOOGLE_CLIENT_ID: 'gid',
      GOOGLE_CLIENT_SECRET: 'gsecret',
      TMP_DIR: '/tmp/lume',
      LOG_LEVEL: 'info',
    });
    expect(env.PORT).toBe(3001);
    expect(env.NODE_ENV).toBe('development');
  });

  it('coerces PORT string to number', () => {
    const env = parseEnv({
      NODE_ENV: 'test',
      PORT: '4000',
      DATABASE_URL: 'postgres://x',
      AUTH_SECRET: 'a'.repeat(48),
      AUTH_URL: 'http://x',
      GOOGLE_CLIENT_ID: 'g',
      GOOGLE_CLIENT_SECRET: 's',
      TMP_DIR: '/tmp/lume',
      LOG_LEVEL: 'silent',
    });
    expect(env.PORT).toBe(4000);
  });

  it('throws when AUTH_SECRET is too short', () => {
    expect(() =>
      parseEnv({
        NODE_ENV: 'development',
        PORT: '3001',
        DATABASE_URL: 'postgres://x',
        AUTH_SECRET: 'short',
        AUTH_URL: 'http://x',
        GOOGLE_CLIENT_ID: 'g',
        GOOGLE_CLIENT_SECRET: 's',
        TMP_DIR: '/tmp/lume',
        LOG_LEVEL: 'silent',
      }),
    ).toThrow(/AUTH_SECRET/);
  });

  it('throws when DATABASE_URL is missing', () => {
    expect(() =>
      parseEnv({
        NODE_ENV: 'development',
        PORT: '3001',
        AUTH_SECRET: 'a'.repeat(48),
        AUTH_URL: 'http://x',
        GOOGLE_CLIENT_ID: 'g',
        GOOGLE_CLIENT_SECRET: 's',
        TMP_DIR: '/tmp/lume',
        LOG_LEVEL: 'silent',
      } as unknown as NodeJS.ProcessEnv),
    ).toThrow(/DATABASE_URL/);
  });
});