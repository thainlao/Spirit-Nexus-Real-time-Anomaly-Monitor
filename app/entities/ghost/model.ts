import { z } from 'zod';

export const ThreatLevel = z.enum(['Low', 'Medium', 'Critical']);
export const Status = z.enum(['Active', 'Captured']);

export const GhostSchema = z.object({
  id: z.string(),
  name: z.string(),
  threatLevel: ThreatLevel,
  location: z.string(),
  status: Status,
});

export type Ghost = z.infer<typeof GhostSchema>;

// In-memory mock store (process memory, reset on server restart)
export let GHOSTS: Ghost[] = [
  { id: '1', name: 'Kitsune', threatLevel: 'Low', location: 'Shibuya', status: 'Active' },
  { id: '2', name: 'Oni', threatLevel: 'Medium', location: 'Shinjuku', status: 'Active' },
  { id: '3', name: 'Yurei', threatLevel: 'Low', location: 'Asakusa', status: 'Active' },
  { id: '4', name: 'Tengu', threatLevel: 'Critical', location: 'Harajuku', status: 'Active' },
];

export function getGhosts() {
  return GHOSTS;
}

export function captureGhost(id: string) {
  const g = GHOSTS.find(x => x.id === id);
  if (!g) throw new Error('Not found');
  if (g.status === 'Captured') return g;
  // 30% chance to simulate failure
  if (Math.random() < 0.3) {
    const e: any = new Error('Simulated failure');
    e.code = 'SIM_FAIL';
    throw e;
  }
  g.status = 'Captured';
  return g;
}

export function randomChangeThreatLevel() {
  if (GHOSTS.length === 0) return undefined;
  const idx = Math.floor(Math.random() * GHOSTS.length);
  const choices = ['Low', 'Medium', 'Critical'] as const;
  const current = GHOSTS[idx].threatLevel;
  let next = current;
  while (next === current) {
    next = choices[Math.floor(Math.random() * choices.length)];
  }
  GHOSTS[idx].threatLevel = next;
  return GHOSTS[idx];
}
