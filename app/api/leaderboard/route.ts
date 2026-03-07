import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'mm:runner:lb';

export async function GET() {
  try {
    // Get top 20 highest scores (rev = descending)
    const raw = await kv.zrange(KEY, 0, 19, { rev: true, withScores: true }) as (string | number)[];
    const entries: { name: string; score: number }[] = [];
    for (let i = 0; i < raw.length; i += 2) {
      entries.push({ name: String(raw[i]), score: Number(raw[i + 1]) });
    }
    return NextResponse.json({ entries }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ entries: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(req: Request) {
  try {
    const { name, score } = await req.json() as { name?: string; score?: number };
    if (!name || typeof score !== 'number' || score <= 0) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const cleanName = name.trim().slice(0, 20);
    if (!cleanName) return NextResponse.json({ error: 'invalid' }, { status: 400 });

    // Only keep best score per name
    const current = await kv.zscore(KEY, cleanName);
    if (current === null || score > Number(current)) {
      await kv.zadd(KEY, { score, member: cleanName });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
