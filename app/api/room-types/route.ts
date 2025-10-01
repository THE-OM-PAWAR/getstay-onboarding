import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const blockId = searchParams.get('blockId');

    if (!blockId) {
      return NextResponse.json(
        { success: false, error: 'Block ID is required' },
        { status: 400 }
      );
    }

    const roomTypes = await RoomType.find({ blockId })
      .populate('components')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: roomTypes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description, components, rent, blockId, images } = body;

    if (!name || !description || !components || components.length === 0 || rent === undefined || !blockId) {
      return NextResponse.json(
        { success: false, error: 'Name, description, at least one component, rent, and block ID are required' },
        { status: 400 }
      );
    }

    const roomType = await RoomType.create({
      name,
      description,
      components,
      rent,
      blockId,
      images: images || [],
    });

    return NextResponse.json({ success: true, data: roomType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
