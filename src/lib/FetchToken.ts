// scripts/fetchGroupsToken.ts
import { chromium } from "playwright";

export async function fetchGroupsToken(email: string, password: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let token: string | null = null;

  try {
    // Intercept network requests to capture the token
    page.on("request", request => {
      if (request.url().includes("/Groups")) { // adjust to the real API path
        const authHeader = request.headers()["authorization"];
        if (authHeader) token = authHeader;
      }
    });

    // Go to login page
    await page.goto("https://bulk.smssouthafrica.co.za/app/#/Login", { waitUntil: "networkidle" });

    // Fill credentials and submit
    await page.fill('input[name="username"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="button"]'); // adjust if needed

    // Wait a short time for SPA navigation
    await page.waitForTimeout(3000);

    // Navigate to Groups page to trigger API call
    await page.goto("https://bulk.smssouthafrica.co.za/app/#/Groups/AddEdit", { waitUntil: "networkidle" });

    // Wait a bit to ensure Groups API request happens
    await page.waitForTimeout(2000);

    if (!token) {
      throw new Error("Failed to capture Authorization token from Groups API");
    }

    
    return token;
  } catch (err: any) {
    console.error("Error fetching Groups token:", err.message);
    throw err;
  } finally {
    await browser.close();
  }
}
