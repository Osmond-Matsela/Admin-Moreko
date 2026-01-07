// scripts/fetchGroupsToken.ts
import { chromium, Browser } from "playwright";

export async function fetchGroupsToken(email: string, password: string): Promise<string> {
  let browser: Browser | null = null;
  
  try {
    console.log('[Playwright] Launching browser...');
    
    browser = await chromium.launch({ 
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ]
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(30000);

    let token: string | null = null;

    // Intercept network requests to capture the token
    await page.route('**/*', async (route) => {
      const request = route.request();
      if (request.url().includes("/Groups")) {
        const authHeader = request.headers()["authorization"];
        if (authHeader && !token) {
          token = authHeader;
          console.log('[Playwright] Token captured!');
        }
      }
      await route.continue();
    });

    // Go to login page
    console.log('[Playwright] Navigating to login...');
    await page.goto("https://bulk.smssouthafrica.co.za/app/#/Login", { 
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // Fill credentials and submit
    console.log('[Playwright] Filling credentials...');
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    await page.fill('input[name="username"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="button"]');

    // Wait for navigation
    await page.waitForTimeout(4000);

    // Navigate to Groups page to trigger API call
    console.log('[Playwright] Navigating to Groups page...');
    await page.goto("https://bulk.smssouthafrica.co.za/app/#/Groups/AddEdit", { 
      waitUntil: "networkidle",
      timeout: 30000
    });

    // Wait to ensure Groups API request happens
    await page.waitForTimeout(3000);

    if (!token) {
      // Fallback: try to get from localStorage
      console.log('[Playwright] Token not captured from request, checking storage...');
      const storageToken = await page.evaluate(() => {
        return localStorage.getItem('token') || 
               localStorage.getItem('authToken') ||
               sessionStorage.getItem('token');
      });
      
      if (storageToken) {
        token = storageToken;
        console.log('[Playwright] Token found in browser storage');
      }
    }

    if (!token) {
      throw new Error("Failed to capture Authorization token from Groups API");
    }

    console.log('[Playwright] Token retrieved successfully');
    return token;
    
  } catch (err: any) {
    console.error("[Playwright] Error fetching Groups token:", err.message);
    throw new Error(`Playwright token fetch failed: ${err.message}`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('[Playwright] Browser closed');
    }
  }
}