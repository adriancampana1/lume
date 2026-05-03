import { z } from 'zod';

export const IncomeBracketSchema = z.enum([
  'up_to_3k',
  'from_3k_to_6k',
  'from_6k_to_12k',
  'from_12k_to_25k',
  'above_25k',
  'prefer_not_to_say',
]);
export type IncomeBracket = z.infer<typeof IncomeBracketSchema>;

export const CategorySchema = z.enum([
  'moradia',
  'mercado',
  'restaurante',
  'transporte',
  'saude',
  'educacao',
  'lazer_e_hobby',
  'compras',
  'assinaturas_e_servicos',
  'transferencias_e_outros',
]);
export type Category = z.infer<typeof CategorySchema>;

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
  timestamp: z.string(),
});
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
