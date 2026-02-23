import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authenticated = request.cookies.get('app_authenticated');

  return NextResponse.json({
    authenticated: authenticated?.value === 'true',
  });
}
