import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://www.instagram.com/api/v1/users/web_profile_info/?username=mhaymhey.stellagrima',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'X-IG-App-ID': '936619743392459',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com',
        },
        next: { revalidate: 300 }, // cache 5 minutes
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'IG fetch failed', status: res.status }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('INSTAGRAM API ERROR', err);
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}
