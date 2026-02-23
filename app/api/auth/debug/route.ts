import { NextResponse } from 'next/server';

export async function GET() {
  const hash = process.env.APP_PASSWORD_HASH;
  
  return NextResponse.json({
    hashExists: !!hash,
    hashLength: hash?.length || 0,
    hashPreview: hash ? `${hash.substring(0, 10)}...` : 'NOT FOUND',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('APP')),
  });
}
