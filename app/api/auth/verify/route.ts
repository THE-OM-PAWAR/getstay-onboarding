import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { PASSWORD_HASH } from '@/lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Try to get hash from environment first, fallback to config file
    const hashedPassword = PASSWORD_HASH;


    if (!hashedPassword) {
      return NextResponse.json(
        { error: 'Server configuration error - APP_PASSWORD_HASH not found' },
        { status: 500 }
      );
    }

    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password valid:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: 'Authentication successful' },
      { status: 200 }
    );

    // Set cookie with 1 day expiration
    response.cookies.set('app_authenticated', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
