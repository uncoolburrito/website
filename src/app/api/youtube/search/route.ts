import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const artist = searchParams.get('artist');

    if (!title || !artist) {
        return NextResponse.json({ error: 'Missing title or artist' }, { status: 400 });
    }

    const query = `${artist} ${title} official audio -live -remix -cover`;
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        console.error("Missing process.env.YOUTUBE_API_KEY. Add it to .env.local.");
        return NextResponse.json({ error: 'Missing YouTube API Key' }, { status: 500 });
    }

    try {
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${apiKey}`);

        if (!res.ok) {
            throw new Error(`YouTube API Error: ${res.statusText}`);
        }

        const data = await res.json();

        if (data.items && data.items.length > 0) {
            return NextResponse.json({ videoId: data.items[0].id.videoId }, {
                headers: {
                    'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200' // Cache per Spotify track ID equivalents for 10 minutes strictly to prevent quota abuse
                }
            });
        }

        return NextResponse.json({ videoId: null }, { status: 404 });
    } catch (error) {
        console.error("YouTube search error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
