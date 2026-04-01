import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

export const dynamic = 'force-dynamic';

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
        cache: 'no-store'
    });
    return await response.json();
};

export async function GET() {
    try {
        const { access_token } = await getAccessToken();

        let favourites: any[] = [];
        let newFinds: any[] = [];
        let hasQuotaError = false;
        
        // Helper to map tracks
        const mapTracks = (items: any[]) => items
            .filter((item: any) => item.track)
            .map((item: any) => ({
                id: item.track.id + Math.random().toString(),
                title: item.track.name,
                artist: item.track.artists.map((a: any) => a.name).join(', '),
                album: item.track.album.name,
                albumArt: item.track.album.images[0]?.url,
                spotifyUrl: item.track.external_urls?.spotify,
                addedAt: item.added_at,
            }));

        const favouritesId = "3UXShJ6695LXudDV774vFh";
        const resFav = await fetch(`https://api.spotify.com/v1/playlists/${favouritesId}/tracks?limit=20`, {
            headers: { Authorization: `Bearer ${access_token}` },
            cache: 'no-store',
        });
        
        if (resFav.ok) {
            const data = await resFav.json();
            favourites = mapTracks(data.items);
        } else if (resFav.status === 403) {
            hasQuotaError = true;
        }
        
        const newFindsId = "02AxJ0YCbrQMkmGRzWnjP2";
        const resNew = await fetch(`https://api.spotify.com/v1/playlists/${newFindsId}/tracks?limit=20`, {
            headers: { Authorization: `Bearer ${access_token}` },
            cache: 'no-store',
        });
        
        if (resNew.ok) {
            const data = await resNew.json();
            newFinds = mapTracks(data.items);
        } else if (resNew.status === 403) {
            hasQuotaError = true;
        }
        
        if (hasQuotaError) {
             return NextResponse.json({ error: 'Spotify API Quota Restricted. Your App needs Extended Access to read tracks.' }, { status: 403 });
        }

        return NextResponse.json({ favourites, newFinds });
    } catch (error) {
        console.error("Spotify Playlists API Error", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
