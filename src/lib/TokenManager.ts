import { adminDb } from "./firebaseAdmin";

export async function getGroupsToken(): Promise<string> {
  try {
    const snap = await adminDb.collection("smsTokens").doc("groups").get();
    
    if (!snap.exists) {
      throw new Error('No token found. Check if Railway token service is running.');
    }

    const data = snap.data();
    const now = Date.now();

    if (!data?.token || !data?.expiry) {
      throw new Error('Invalid token data');
    }

    if (now > data.expiry) {
      throw new Error('Token expired. Waiting for refresh service.');
    }

    const timeLeft = Math.round((data.expiry - now) / 1000);
    console.log(`[TokenManager] Token valid for ${timeLeft}s`);

    return data.token;

  } catch (error) {
    console.error('[TokenManager] Error:', error);
    throw error;
  }
}