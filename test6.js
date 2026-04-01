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

    const p1 = await fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M/tracks?limit=1', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Spotify Playlist Tracks:", p1.status, await p1.text());
}

test();
