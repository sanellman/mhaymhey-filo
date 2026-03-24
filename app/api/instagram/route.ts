import { NextResponse } from 'next/server';

export const revalidate = 86400; // revalidate once per day at most

export async function GET() {
  try {
    const res = await fetch(
      'https://www.instagram.com/api/v1/users/web_profile_info/?username=mhaymhey.stellagrima',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'X-ASBD-ID': '129477',
          'X-CSRFToken': 'RPVdwTY6IDS3FTP1QKD8jYS81YvZXX52',
          'X-IG-App-ID': '936619743392459',
          'X-Requested-With': 'XMLHttpRequest',
          'Referer': 'https://www.instagram.com/',
          'Origin': 'https://www.instagram.com',
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'IG fetch failed', status: res.status }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    console.error('INSTAGRAM API ERROR', err);
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}
