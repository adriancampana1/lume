import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const incomeBracket = pgEnum('income_bracket', [
  'up_to_3k',
  'from_3k_to_6k',
  'from_6k_to_12k',
  'from_12k_to_25k',
  'above_25k',
  'prefer_not_to_say',
]);

export const uploadSessionStatus = pgEnum('upload_session_status', [
  'pending',
  'processing',
  'completed',
  'expired',
  'failed',
]);

// === USERS (Auth.js compatible) ===
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  image: text('image'),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  incomeBracket: incomeBracket('income_bracket'),
  marketingOptIn: boolean('marketing_opt_in').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

// === ACCOUNTS (OAuth providers — Auth.js standard) ===
export const accounts = pgTable(
  'accounts',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    refreshToken: text('refresh_token'),
    accessToken: text('access_token'),
    expiresAt: integer('expires_at'),
    tokenType: text('token_type'),
    scope: text('scope'),
    idToken: text('id_token'),
    sessionState: text('session_state'),
  },
  (account) => ({
    pk: primaryKey({ columns: [account.provider, account.providerAccountId] }),
    userIdx: index('accounts_user_idx').on(account.userId),
  }),
);

// === SESSIONS (Auth.js standard) ===
export const sessions = pgTable(
  'sessions',
  {
    sessionToken: text('session_token').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (t) => ({
    userIdx: index('sessions_user_idx').on(t.userId),
    expiresIdx: index('sessions_expires_idx').on(t.expires),
  }),
);

// === VERIFICATION TOKENS (Auth.js standard) ===
export const verificationTokens = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull(),
  },
  (vt) => ({
    pk: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

// === UPLOAD SESSIONS (apenas metadata, NUNCA conteúdo) ===
export const uploadSessions = pgTable(
  'upload_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    anonCookieId: text('anon_cookie_id').notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    fileCount: integer('file_count').notNull().default(0),
    totalBytes: integer('total_bytes').notNull().default(0),
    status: uploadSessionStatus('status').notNull().default('pending'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp('expires_at', { withTimezone: true })
      .notNull()
      .default(sql`now() + interval '30 minutes'`),
  },
  (t) => ({
    anonIdx: index('upload_sessions_anon_idx').on(t.anonCookieId),
    userIdx: index('upload_sessions_user_idx').on(t.userId),
    expIdx: index('upload_sessions_expires_idx').on(t.expiresAt),
  }),
);

// === REPORTS (apenas metadata) ===
export const reports = pgTable(
  'reports',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    periodStart: timestamp('period_start', { withTimezone: true }).notNull(),
    periodEnd: timestamp('period_end', { withTimezone: true }).notNull(),
    transactionsCount: integer('transactions_count').notNull(),
    categoryCount: integer('category_count').notNull(),
    pdfSizeBytes: integer('pdf_size_bytes').notNull(),
    llmTokensUsed: integer('llm_tokens_used').notNull().default(0),
    llmCostCents: integer('llm_cost_cents').notNull().default(0),
    generatedAt: timestamp('generated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('reports_user_idx').on(t.userId),
    genIdx: index('reports_generated_at_idx').on(t.generatedAt),
  }),
);

// === RATE LIMITS (cap de 30 dias rolling) ===
export const rateLimits = pgTable('rate_limits', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  lastReportAt: timestamp('last_report_at', { withTimezone: true }),
  reportsCount30d: integer('reports_count_30d').notNull().default(0),
  nextAvailableAt: timestamp('next_available_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// === REPORT QUEUE (global cap overflow) ===
export const reportQueueStatus = pgEnum('report_queue_status', [
  'queued',
  'processing',
  'sent',
  'failed',
]);

export const reportQueue = pgTable(
  'report_queue',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    sessionId: uuid('session_id').notNull(),
    status: reportQueueStatus('status').notNull().default('queued'),
    queuedAt: timestamp('queued_at', { withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    failureReason: text('failure_reason'),
  },
  (t) => ({
    statusIdx: index('report_queue_status_idx').on(t.status),
    userIdx: index('report_queue_user_idx').on(t.userId),
  }),
);

// === AUDIT LOG (LGPD) ===
export const auditAction = pgEnum('audit_action', [
  'profile_export',
  'profile_delete',
  'marketing_opt_in_changed',
  'income_changed',
  'sign_in',
  'sign_out',
]);

export const auditLog = pgTable(
  'audit_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    action: auditAction('action').notNull(),
    detail: jsonb('detail').notNull().default({}),
    ip: text('ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('audit_log_user_idx').on(t.userId),
    actionIdx: index('audit_log_action_idx').on(t.action),
    timeIdx: index('audit_log_time_idx').on(t.createdAt),
  }),
);

// === METRICS EVENTS (telemetria minimalista) ===
export const metricsEvents = pgTable(
  'metrics_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    eventType: text('event_type').notNull(),
    properties: jsonb('properties').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    typeIdx: index('metrics_events_type_idx').on(t.eventType),
    userIdx: index('metrics_events_user_idx').on(t.userId),
    timeIdx: index('metrics_events_created_idx').on(t.createdAt),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UploadSession = typeof uploadSessions.$inferSelect;
export type Report = typeof reports.$inferSelect;
export type RateLimit = typeof rateLimits.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type MetricsEvent = typeof metricsEvents.$inferSelect;
export type NewMetricsEvent = typeof metricsEvents.$inferInsert;
export type ReportQueue = typeof reportQueue.$inferSelect;
export type AuditLog = typeof auditLog.$inferSelect;
