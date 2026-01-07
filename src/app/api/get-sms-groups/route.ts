import { getGroupsToken } from '@/lib/TokenManager';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Starting API request...');
    let apiKey = await getGroupsToken();
    console.log('Token retrieved:', apiKey ? 'Yes' : 'No');

    const url = 'https://bulk.smssouthafrica.co.za/api/App/Client/NumberManagement/Groups';

    async function callApi(token: string) {
      console.log('Calling API with token...');
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': token,
        }
      });
      console.log('API response status:', res.status);
      return res;
    }

    let response = await callApi(apiKey);

    if (response.status === 401 || response.status === 403) {
      console.log('Token expired, refreshing...');
      apiKey = await getGroupsToken(true);
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
    // Enhanced error logging
    console.error('=== FULL ERROR DETAILS ===');
    console.error('Error name:', err instanceof Error ? err.name : 'Unknown');
    console.error('Error message:', err instanceof Error ? err.message : String(err));
    console.error('Error stack:', err instanceof Error ? err.stack : 'No stack');
    console.error('========================');
    
    return NextResponse.json({
      error: 'Failed to fetch data',
      message: err instanceof Error ? err.message : String(err),
      stack: process.env.NODE_ENV === 'development' ? (err instanceof Error ? err.stack : undefined) : undefined
    }, { status: 500 });
  }
}