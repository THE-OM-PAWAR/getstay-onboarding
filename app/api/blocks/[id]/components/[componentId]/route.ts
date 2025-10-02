import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; componentId: string } }
) {
  try {
    await connectDB();

    const { id: blockId, componentId } = params;
    const body = await request.json();
    const { name, description } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const component = await RoomComponent.findOneAndUpdate(
      { _id: componentId, blockId },
      { name, description },
      { new: true }
    );

    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: component });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; componentId: string } }
) {
  try {
    await connectDB();

    const { id: blockId, componentId } = params;

    const component = await RoomComponent.findOneAndDelete({
      _id: componentId,
      blockId,
    });

    if (!component) {
      return NextResponse.json(
        { success: false, error: 'Component not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: component });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
