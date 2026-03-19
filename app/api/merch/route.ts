import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://sc-oms-api.line-apps.com/api/v1/shopend/@siamdol/product/1007977948',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // realtime
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error('MERCH API ERROR', err);
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}