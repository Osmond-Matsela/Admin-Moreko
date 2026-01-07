import { getGroupsToken } from '@/lib/TokenManager';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  let apiKey = await getGroupsToken();

  const url = 'https://bulk.smssouthafrica.co.za/api/App/Client/NumberManagement/Groups';

  async function callApi(token: string) {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': token,
      }
    });
    return res;
  }

  try {
    let response = await callApi(apiKey);

    // Retry once if unauthorized
    if (response.status === 401 || response.status === 403) {
      console.log('Token expired, refreshing...');
      apiKey = await getGroupsToken(true); // Pass true to force refresh
      response = await callApi(apiKey);
    }

    if (!response.ok) {
      const text = await response.text();
      console.error('API Error:', response.status, text);
      return NextResponse.json({
        error: 'API request failed',
        status: response.status,
        details: text
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error('Fetch Error:', err);
    return NextResponse.json({
      error: 'Failed to fetch data',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}