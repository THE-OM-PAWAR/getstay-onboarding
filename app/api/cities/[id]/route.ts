import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { City } from '@/lib/mongoose/models/city.model';

function generateSlug(name: string): string {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const body = await request.json();
    const { name, state, introContent, metaTitle, metaDescription } = body;

    const update: any = {
      introContent,
      metaTitle,
      metaDescription,
    };

    if (name) {
      update.name = name;
      update.slug = generateSlug(name);
    }

    if (state) {
      update.state = state;
    }

    try {
      const city = await City.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      });

      if (!city) {
        return NextResponse.json(
          { success: false, error: 'City not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: city });
    } catch (error: any) {
      if (error.code === 11000 && error.keyPattern?.slug) {
        return NextResponse.json(
          { success: false, error: 'A city with this name already exists' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: error.message || 'Failed to update city' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update city' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    const city = await City.findByIdAndDelete(id);

    if (!city) {
      return NextResponse.json(
        { success: false, error: 'City not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: city });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete city' },
      { status: 500 }
    );
  }
}

