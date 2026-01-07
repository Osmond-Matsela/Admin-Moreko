import { fetchGroupsToken } from "./FetchToken";
import { adminDb } from "./firebaseAdmin";

const TOKEN_LIFETIME = 15 * 60 * 1000;
const TOKEN_REFRESH_THRESHOLD = 60 * 1000;

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;
let refreshPromise: Promise<string> | null = null;

async function storeSMSToken(token: string, expiry: number) {
  try {
    await adminDb.collection("smsTokens").doc("groups").set({
      token,
      expiry,
      updatedAt: Date.now(),
    });
    console.log('[TokenManager] Token stored in Firestore');
  } catch (error) {
    console.error('[TokenManager] Failed to store token:', error);
    // Don't throw - token is still usable even if storage fails
  }
}

async function loadSMSToken() {
  try {
    const snap = await adminDb.collection("smsTokens").doc("groups").get();
    if (!snap.exists) {
      console.log('[TokenManager] No token in Firestore');
      return null;
    }

    const data = snap.data();
    if (!data?.token || !data?.expiry || typeof data.expiry !== "number") {
      console.log('[TokenManager] Invalid token data in Firestore');
      return null;
    }

    console.log('[TokenManager] Token loaded from Firestore');
    return { token: data.token, expiry: data.expiry };
  } catch (error) {
    console.error('[TokenManager] Failed to load token:', error);
    return null;
  }
}

async function refreshToken() {
  if (refreshPromise) {
    console.log('[TokenManager] Refresh already in progress, waiting...');
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      console.log('[TokenManager] Starting token refresh with Playwright...');
      
      const email = process.env.SMS_EMAIL;
      const password = process.env.SMS_PASSWORD;

      if (!email || !password) {
        throw new Error('SMS_EMAIL or SMS_PASSWORD environment variables are missing');
      }

      const token = await fetchGroupsToken(email, password);
      
      if (!token) {
        throw new Error('fetchGroupsToken returned empty token');
      }

      const expiry = Date.now() + TOKEN_LIFETIME;

      cachedToken = token;
      tokenExpiry = expiry;

      await storeSMSToken(token, expiry);

      console.log('[TokenManager] Token refreshed successfully');
      return token;
      
    } catch (error) {
      console.error('[TokenManager] Token refresh failed:', error);
      // Clear cache on failure
      cachedToken = null;
      tokenExpiry = null;
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function getGroupsToken(forceRefresh: boolean = false) {
  const now = Date.now();

  try {
    // Force refresh invalidates cache
    if (forceRefresh) {
      console.log('[TokenManager] Force refresh requested');
      cachedToken = null;
      tokenExpiry = null;
      return await refreshToken();
    }

    // Load from memory or DB
    if (!cachedToken || !tokenExpiry) {
      console.log('[TokenManager] No cached token, loading from Firestore...');
      const dbCache = await loadSMSToken();
      if (dbCache) {
        cachedToken = dbCache.token;
        tokenExpiry = dbCache.expiry;
      }
    }

    // Return cached token if still valid
    if (cachedToken && tokenExpiry && now < tokenExpiry - TOKEN_REFRESH_THRESHOLD) {
      const timeLeft = Math.round((tokenExpiry - now) / 1000);
      console.log(`[TokenManager] Returning cached token (expires in ${timeLeft}s)`);
      return cachedToken;
    }

    // Refresh token
    console.log('[TokenManager] Token expired or near expiry, refreshing...');
    return await refreshToken();
    
  } catch (error) {
    console.error('[TokenManager] getGroupsToken error:', error);
    throw error;
  }
}