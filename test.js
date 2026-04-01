const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '9c9d1d9e01d84e138e9036c0afc2e89a';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || 'bd0463554b0a481caebf7e8091816d76';

async function test() {
    // 1. Get Client Credentials Token
    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        }),
    });
    const data = await response.json();
    const token = data.access_token;
    console.log("Token:", token ? "Success" : "Failed");

    // 2. Query Playlists
    const p1 = await fetch('https://api.spotify.com/v1/playlists/3UXShJ6695LXudDV774vFh', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Favourites:", p1.status, await p1.text());

    const p2 = await fetch('https://api.spotify.com/v1/playlists/02AxJ0YCbrQMkmGRzWnjP2', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log("New Finds:", p2.status, await p2.text());
}

test();
