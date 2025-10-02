import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { Block } from '@/lib/mongoose/models/block.model';
import { RoomType } from '@/lib/mongoose/models/room-type.model';
import { RoomComponent } from '@/lib/mongoose/models/room-component.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const block = await Block.findById(params.id).populate('hostel');

    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: block });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const body = await request.json();

    const block = await Block.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: block });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Check if block exists
    const block = await Block.findById(params.id);
    if (!block) {
      return NextResponse.json(
        { success: false, error: 'Block not found' },
        { status: 404 }
      );
    }

    // Check if there are any room types associated with this block
    const roomTypeCount = await RoomType.countDocuments({ blockId: params.id });
    if (roomTypeCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete block. There are ${roomTypeCount} room type(s) associated with this block. Please delete all room types first.`,
          roomTypeCount 
        },
        { status: 400 }
      );
    }

    // Check if there are any room components associated with this block
    const componentCount = await RoomComponent.countDocuments({ blockId: params.id });
    if (componentCount > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Cannot delete block. There are ${componentCount} room component(s) associated with this block. Please delete all room components first.`,
          componentCount 
        },
        { status: 400 }
      );
    }

    // If no room types or components exist, proceed with deletion
    await Block.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Block deleted successfully',
      data: {} 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
