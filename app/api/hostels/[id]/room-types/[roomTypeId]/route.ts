import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; roomTypeId: string } }
) {
  try {
    await connectDB();

    const { id: hostelId, roomTypeId } = params;
    const body = await request.json();
    const { name, description, components, rent, images } = body;

    if (!name || !description || !components || !rent) {
      return NextResponse.json(
        { success: false, error: 'Name, description, components, and rent are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(components) || components.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one component is required' },
        { status: 400 }
      );
    }

    // Ensure only one cover image
    if (images && Array.isArray(images)) {
      let coverCount = 0;
      images.forEach((img: any) => {
        if (img.isCover) coverCount++;
      });
      
      if (coverCount > 1) {
        // Reset all to false and set first as cover
        images.forEach((img: any, index: number) => {
          img.isCover = index === 0;
        });
      } else if (coverCount === 0 && images.length > 0) {
        // Set first image as cover if none is set
        images[0].isCover = true;
      }
    }

    const roomType = await RoomType.findOneAndUpdate(
      { _id: roomTypeId, hostelId },
      {
        name,
        description,
        components,
        rent: parseFloat(rent),
        images: images || [],
      },
      { new: true }
    ).populate('components', 'name description');

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: 'Room type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roomType });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; roomTypeId: string } }
) {
  try {
    await connectDB();

    const { id: hostelId, roomTypeId } = params;

    const roomType = await RoomType.findOneAndDelete({
      _id: roomTypeId,
      hostelId,
    });

    if (!roomType) {
      return NextResponse.json(
        { success: false, error: 'Room type not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: roomType });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
