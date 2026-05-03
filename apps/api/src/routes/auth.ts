import { Hono } from 'hono';
import { authHandler, initAuthConfig } from '@hono/auth-js';
import { authConfig } from '../lib/auth.js';
import type { Variables } from '../types.js';

export const authRoute = new Hono<{ Variables: Variables }>();

authRoute.use('*', initAuthConfig(() => authConfig));
authRoute.use('*', authHandler());