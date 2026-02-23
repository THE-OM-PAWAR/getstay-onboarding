import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { City } from '@/lib/mongoose/models/city.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const cities = await City.find({}).sort({ name: 1 });

    return NextResponse.json({ success: true, data: cities });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch cities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, state, introContent, metaTitle, metaDescription } = body;

    if (!name || !state) {
      return NextResponse.json(
        { success: false, error: 'Name and state are required' },
        { status: 400 }
      );
    }

    try {
      const city = await City.create({
        name,
        state,
        introContent,
        metaTitle,
        metaDescription,
      });

      return NextResponse.json({ success: true, data: city }, { status: 201 });
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        return NextResponse.json(
          { success: false, error: 'A city with this name already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message || 'Failed to create city' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create city' },
      { status: 500 }
    );
  }
}

