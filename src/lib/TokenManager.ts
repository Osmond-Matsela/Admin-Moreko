import { fetchGroupsToken } from "./FetchToken";
import { adminDb } from "./firebaseAdmin"; // your initialized Firestore Admin instance

const TOKEN_LIFETIME = 15 * 60 * 1000; // 15 minutes
const TOKEN_REFRESH_THRESHOLD = 1 * 60 * 1000; // refresh 1 min before expiry

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

// Firestore helpers
async function storeSMSToken(token: string, expiry: number) {
  await adminDb.collection("smsTokens").doc("groups").set({
    token,
    expiry,
    updatedAt: Date.now(),
  });
}

async function loadSMSToken(): Promise<{ token: string; expiry: number } | null> {
  const doc = await adminDb.collection("smsTokens").doc("groups").get();
  if (!doc.exists) return null;
  return doc.data() as { token: string; expiry: number };
}

export async function getGroupsToken() {
  const now = Date.now();

  // Load from Firestore if in-memory cache is empty
  if (!cachedToken || !tokenExpiry) {
    const dbCache = await loadSMSToken();
    if (dbCache) {
      cachedToken = dbCache.token;
      tokenExpiry = dbCache.expiry;
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

  // Save to Firestore
  await storeSMSToken(cachedToken, tokenExpiry);

  return cachedToken;
}