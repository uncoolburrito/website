import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis client silently without throwing hard crashes inside dev mode if keys are missing
const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const redis = (redisUrl && redisToken)
    ? new Redis({
        url: redisUrl,
        token: redisToken,
    })
    : null;

export const dynamic = 'force-dynamic';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || '';

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

    const data = await response.json();
    if (!response.ok) {
        console.error("Spotify Token Fetch Error:", data);
    }
    return data;
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

        if (songObj && songObj.item) {
            const isPlaying = songObj.is_playing;
            const title = songObj.item.name;
            const artist = songObj.item.artists.map((_artist: any) => _artist.name).join(', ');
            const album = songObj.item.album.name;
            const albumArt = songObj.item.album.images[0]?.url;
            const spotifyUrl = songObj.item.external_urls?.spotify || '';
            const progressMs = songObj.progress_ms || 0;
            const durationMs = songObj.item.duration_ms || 0;

            const payload = {
                album,
                albumArt,
                artist,
                isPlaying,
                spotifyUrl,
                title,
                progressMs,
                durationMs,
            };

            // Fire and forget cache save
            try {
                if (redis) {
                    redis.set("last_played_song", JSON.stringify(payload)).catch(e => console.error("Upstash Save Background Error:", e));
                }
            } catch (e) {
                console.error("Upstash Setup Error:", e);
            }

            return NextResponse.json(payload, { status: 200 });
        } else {
            // Entirely Offline - Dig into Redis Cache
            try {
                if (redis) {
                    const cachedSong = await redis.get("last_played_song");
                    if (cachedSong) {
                        const parsed = typeof cachedSong === 'string' ? JSON.parse(cachedSong) : cachedSong;
                        return NextResponse.json({ ...parsed, isPlaying: false, progressMs: 0 }, { status: 200 });
                    }
                }
            } catch (dbError) {
                console.error("Upstash Redis Cache Fetch Error:", dbError);
            }
            return NextResponse.json({ isPlaying: false }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ isPlaying: false }, { status: 200 });
    }
}
