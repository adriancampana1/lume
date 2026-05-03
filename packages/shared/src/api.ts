import { z } from 'zod';
import { IncomeBracketSchema } from './schemas.js';

export const SessionUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().url().nullable(),
  incomeBracket: IncomeBracketSchema.nullable(),
  marketingOptIn: z.boolean(),
  hasOnboarded: z.boolean(),
});
export type SessionUser = z.infer<typeof SessionUserSchema>;

export const CreateSessionResponseSchema = z.object({
  sessionId: z.string().uuid(),
  expiresAt: z.string().datetime(),
});
export type CreateSessionResponse = z.infer<typeof CreateSessionResponseSchema>;

export const ClaimSessionResponseSchema = z.object({
  ok: z.literal(true),
  sessionId: z.string().uuid(),
});
export type ClaimSessionResponse = z.infer<typeof ClaimSessionResponseSchema>;

export const OnboardingPayloadSchema = z.object({
  incomeBracket: IncomeBracketSchema,
  marketingOptIn: z.boolean().default(false),
});
export type OnboardingPayload = z.infer<typeof OnboardingPayloadSchema>;

export const UpdateProfilePayloadSchema = z.object({
  incomeBracket: IncomeBracketSchema.optional(),
  marketingOptIn: z.boolean().optional(),
});
export type UpdateProfilePayload = z.infer<typeof UpdateProfilePayloadSchema>;

export const UserDataExportSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().nullable(),
    image: z.string().nullable(),
    incomeBracket: IncomeBracketSchema.nullable(),
    marketingOptIn: z.boolean(),
    createdAt: z.string().datetime(),
    lastSeenAt: z.string().datetime(),
  }),
  reports: z.array(
    z.object({
      id: z.string().uuid(),
      periodStart: z.string().datetime(),
      periodEnd: z.string().datetime(),
      transactionsCount: z.number().int(),
      categoryCount: z.number().int(),
      generatedAt: z.string().datetime(),
    }),
  ),
  uploadSessions: z.array(
    z.object({
      id: z.string().uuid(),
      fileCount: z.number().int(),
      totalBytes: z.number().int(),
      status: z.string(),
      createdAt: z.string().datetime(),
    }),
  ),
  exportedAt: z.string().datetime(),
});
export type UserDataExport = z.infer<typeof UserDataExportSchema>;