const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '9c9d1d9e01d84e138e9036c0afc2e89a';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'bd0463554b0a481caebf7e8091816d76';

async function test() {
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'client_credentials' }),
    });
    const data = await response.json();
    const token = data.access_token;

    const p1 = await fetch('https://api.spotify.com/v1/playlists/3UXShJ6695LXudDV774vFh', {
        headers: { Authorization: `Bearer ${token}` }
    });
    const p1Data = await p1.json();
    console.log("Favourites total tracks:", p1Data.tracks?.total, "Items length:", p1Data.tracks?.items?.length);
    if(p1Data.tracks?.items?.length > 0) {
        console.log("First track:", p1Data.tracks.items[0].track?.name);
    }
}

test();
