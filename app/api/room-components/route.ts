import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const hostelId = searchParams.get('hostelId');

    if (!hostelId) {
      return NextResponse.json(
        { success: false, error: 'Hostel ID is required' },
        { status: 400 }
      );
    }

    const components = await RoomComponent.find({ hostelId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: components });
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
    const { name, description, hostelId } = body;

    if (!name || !description || !hostelId) {
      return NextResponse.json(
        { success: false, error: 'Name, description, and hostel ID are required' },
        { status: 400 }
      );
    }

    const component = await RoomComponent.create({
      name,
      description,
      hostelId,
    });

    return NextResponse.json({ success: true, data: component }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
