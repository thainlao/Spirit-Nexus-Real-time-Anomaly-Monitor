import { captureGhost, getGhosts, GhostSchema } from '@/app/entities/ghost/model';
import { NextResponse } from 'next/server';

export async function GET() {
  const list = getGhosts();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = String(body.id);
    const updated = captureGhost(id);
    GhostSchema.parse(updated);
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error' }, { status: 500 });
  }
}
