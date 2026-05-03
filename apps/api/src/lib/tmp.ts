import { mkdir, readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

export function sessionsRootPath(rootDir: string): string {
  return join(rootDir, 'sessions');
}

export function sessionDirPath(rootDir: string, sessionId: string): string {
  return join(sessionsRootPath(rootDir), sessionId);
}

export async function ensureSessionDir(rootDir: string, sessionId: string): Promise<string> {
  const p = sessionDirPath(rootDir, sessionId);
  await mkdir(p, { recursive: true, mode: 0o700 });
  return p;
}

export async function listSessionDirs(rootDir: string): Promise<string[]> {
  const root = sessionsRootPath(rootDir);
  try {
    const entries = await readdir(root, { withFileTypes: true });
    return entries.filter((e) => e.isDirectory()).map((e) => e.name);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

export async function removeSessionDir(rootDir: string, sessionId: string): Promise<void> {
  const p = sessionDirPath(rootDir, sessionId);
  await rm(p, { recursive: true, force: true });
}

export async function sessionDirAgeMs(
  rootDir: string,
  sessionId: string,
): Promise<number | null> {
  try {
    const st = await stat(sessionDirPath(rootDir, sessionId));
    return Date.now() - st.mtimeMs;
  } catch {
    return null;
  }
}