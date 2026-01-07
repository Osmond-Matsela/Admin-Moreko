import { fetchGroupsToken } from "./FetchToken";
import { adminDb } from "./firebaseAdmin";

const TOKEN_LIFETIME = 15 * 60 * 1000;
const TOKEN_REFRESH_THRESHOLD = 60 * 1000;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
let refreshPromise: Promise<string> | null = null;

async function storeSMSToken(token: string, expiry: number) {
  await adminDb.collection("smsTokens").doc("groups").set({
    token,
    expiry,
    updatedAt: Date.now(),
  });
}

async function loadSMSToken() {
  const snap = await adminDb.collection("smsTokens").doc("groups").get();
  if (!snap.exists) return null;

  const data = snap.data();
  if (!data?.token || !data?.expiry || typeof data.expiry !== "number") {
    return null;
  }

  return { token: data.token, expiry: data.expiry };
}

async function refreshToken() {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const email = process.env.SMS_EMAIL!;
    const password = process.env.SMS_PASSWORD!;

    const token = await fetchGroupsToken(email, password);
    const expiry = Date.now() + TOKEN_LIFETIME;

    cachedToken = token;
    tokenExpiry = expiry;

    await storeSMSToken(token, expiry);

    refreshPromise = null;
    return token;
  })();

  return refreshPromise;
}

export async function getGroupsToken(forceRefresh: boolean = false) {
  const now = Date.now();

  // Force refresh invalidates cache
  if (forceRefresh) {
    cachedToken = null;
    tokenExpiry = null;
    return refreshToken();
  }

  // Load from memory or DB
  if (!cachedToken || !tokenExpiry) {
    const dbCache = await loadSMSToken();
    if (dbCache) {
      cachedToken = dbCache.token;
      tokenExpiry = dbCache.expiry;
    }
  }

  // Return cached token if still valid
  if (cachedToken && tokenExpiry && now < tokenExpiry - TOKEN_REFRESH_THRESHOLD) {
    return cachedToken;
  }

  // Refresh token
  return refreshToken();
}