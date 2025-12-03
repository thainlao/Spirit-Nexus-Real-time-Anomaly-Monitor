import { getGhosts, randomChangeThreatLevel } from '@/app/entities/ghost/model';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const send = (data: any) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    writer.write(encoder.encode(payload));
  };

  // send initial snapshot
  send({ type: 'snapshot', ghosts: getGhosts() });

  const interval = setInterval(() => {
    const changed = randomChangeThreatLevel();
    if (changed) send({ type: 'threatUpdate', ghost: changed });
  }, 5000);

  req.signal.addEventListener('abort', () => {
    clearInterval(interval);
    try { writer.close(); } catch {}
  });

  return new NextResponse(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
