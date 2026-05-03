import { z } from 'zod';

export const IncomeBracketSchema = z.enum([
  '<= 15k',
  '15k - 30k',
  '30k - 50k',
  '50k - 100k',
  '100k - 200k',
  '> 200k'
]);

export type IncomeBracket = z.infer<typeof IncomeBracketSchema>;

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional()
});

export type Category = z.infer<typeof CategorySchema>;

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string()
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
