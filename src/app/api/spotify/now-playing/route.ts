import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || 'c1b7629bd68641a299447cc202fda899';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '267defce257b48a991171c21ce00f9c2';
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || 'AQBv4hD6BPDsEZwZWdJPhBdQ4hkrSeywWzoGH_GzQ4vJPxOJCJGaTvT21H3SVJWuUnAN4QSsykS8jd3QdpwRbk5yNm4uS67scO_bzc7RG7zIeGyojoMxbr97k1QXP4Xj0Gc';

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: REFRESH_TOKEN,
        }),
        cache: 'no-store'
    });
    return response.json();
};

export async function GET() {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch(NOW_PLAYING_ENDPOINT, {
            headers: { Authorization: `Bearer ${access_token}` },
            cache: 'no-store', // Prevent Next.js from aggressively caching the song data
        });

        let songObj = null;

        if (response.status === 204 || response.status > 400) {
            // Fallback to Recently Played
            const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
                headers: { Authorization: `Bearer ${access_token}` },
                cache: 'no-store',
            });
            if (recentRes.status === 200) {
                const recentData = await recentRes.json();
                if (recentData.items && recentData.items.length > 0) {
                    songObj = { item: recentData.items[0].track, is_playing: false };
                }
            }
        } else {
            const liveData = await response.json();
            if (liveData.item) {
                songObj = liveData;
            }
        }

        if (!songObj || !songObj.item) {
            return NextResponse.json({ isPlaying: false }, { status: 200 });
        }

        const isPlaying = songObj.is_playing;
        const title = songObj.item.name;
        const artist = songObj.item.artists.map((_artist: any) => _artist.name).join(', ');
        const album = songObj.item.album.name;
        const albumArt = songObj.item.album.images[0]?.url;
        const spotifyUrl = songObj.item.external_urls?.spotify || '';
        const progressMs = songObj.progress_ms || 0;
        const durationMs = songObj.item.duration_ms || 0;

        return NextResponse.json({
            album,
            albumArt,
            artist,
            isPlaying,
            spotifyUrl,
            title,
            progressMs,
            durationMs,
        }, {
            status: 200,
        });
    } catch (error) {
        return NextResponse.json({ isPlaying: false }, { status: 200 });
    }
}
