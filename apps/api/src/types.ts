import type { SessionUser } from '@lume/shared';

export type Variables = {
  user?: SessionUser;
  anonSessionId?: string;
};