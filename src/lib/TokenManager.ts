import fs from "fs";
import path from "path";
import { fetchGroupsToken } from "./FetchToken";

const CACHE_FILE = path.join(process.cwd(), "groupsToken.json");

const TOKEN_LIFETIME = 15 * 60 * 1000; // assume 15 min, or measure experimentally
const TOKEN_REFRESH_THRESHOLD = 1 * 60 * 1000; // refresh 1 min before expiry

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// File-based helpers
function saveToken(token: string, expiry: number) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify({ token, expiry }));
}

function loadToken(): { token: string; expiry: number } | null {
  if (!fs.existsSync(CACHE_FILE)) return null;
  return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

export async function getGroupsToken() {
  const now = Date.now();

  // Load from file cache if in-memory cache is empty
  if (!cachedToken || !tokenExpiry) {
    const fileCache = loadToken();
    if (fileCache) {
      cachedToken = fileCache.token;
      tokenExpiry = fileCache.expiry;
    }
  }

  // Use cached token if still valid
  if (cachedToken && tokenExpiry && now < tokenExpiry - TOKEN_REFRESH_THRESHOLD) {
    return cachedToken;
  }

  // Fetch a new token if missing or about to expire
  const email = process.env.SMS_EMAIL!;
  const password = process.env.SMS_PASSWORD!;

  cachedToken = await fetchGroupsToken(email, password);
  tokenExpiry = now + TOKEN_LIFETIME;

  // Save to file cache
  saveToken(cachedToken, tokenExpiry);

  return cachedToken;
}
