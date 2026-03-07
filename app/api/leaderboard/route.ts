import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

const KEY = 'mm:runner:lb';

const HEADERS = { 'Cache-Control': 'no-store' };

export async function GET() {
  try {
    const members = await kv.zrange(KEY, 0, 19, { rev: true }) as string[];
    if (!members.length) return NextResponse.json({ entries: [] }, { headers: HEADERS });

    const scores = await Promise.all(members.map((m) => kv.zscore(KEY, m)));
    const entries = members.map((name, i) => ({ name, score: Number(scores[i] ?? 0) }));
    return NextResponse.json({ entries }, { headers: HEADERS });
  } catch (err) {
    console.error('[leaderboard GET]', err);
    return NextResponse.json({ entries: [], error: 'kv_unavailable' }, { headers: HEADERS });
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
  } catch (err) {
    console.error('[leaderboard POST]', err);
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
