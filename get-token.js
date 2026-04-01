const readline = require('readline');
const fs = require('fs');

// Simple parser for .env.local
const env = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
      acc[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return acc;
}, {});

const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:3000'; // Match what's in your dashboard

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Could not find SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local");
  process.exit(1);
}

const scopes = [
  'user-read-currently-playing',
  'user-read-recently-played',
  'playlist-read-private',
  'playlist-read-collaborative'
].join('%20');

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${scopes}`;

console.log("\n=============================================");
console.log("1. Go to your Spotify Developer Dashboard and ensure your Redirect URI is set exactly to:");
console.log(`   ${REDIRECT_URI}`);
console.log("\n2. Click or copy this link into your browser to authorize:");
console.log(`\n${authUrl}\n`);
console.log("3. After you approve, you will be redirected to a broken/local page. Look at the URL.");
console.log("   It will look like: http://localhost:3000/?code=AQA...something...");
console.log("   Copy that ENTIRE code (everything after '?code=').");
console.log("=============================================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Paste your code here: ', async (code) => {
  if (!code) {
      console.log("No code provided. Exiting.");
      rl.close();
      return;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Authorization': `Basic ${basic}`,
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: code.trim(),
              redirect_uri: REDIRECT_URI
          })
      });

      const data = await response.json();
      
      if (data.error) {
          console.error("\nError getting token:", data.error, data.error_description);
      } else {
          console.log("\n✅ SUCCESS! Here is your new refresh token:\n");
          console.log(data.refresh_token);
          console.log("\n👉 Replace your SPOTIFY_REFRESH_TOKEN in .env.local with the above token!");
      }
  } catch (e) {
      console.error("\nAn error occurred:", e);
  }
  
  rl.close();
});
