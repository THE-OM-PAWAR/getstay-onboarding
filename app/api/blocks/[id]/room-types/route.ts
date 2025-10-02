import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { RoomType } from '@/lib/mongoose/models/room-type.model';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const blockId = params.id;

    if (!blockId) {
      return NextResponse.json(
        { success: false, error: 'Block ID is required' },
        { status: 400 }
      );
    }

    const roomTypes = await RoomType.find({ blockId })
      .populate('components', 'name description')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: roomTypes });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const blockId = params.id;
    const body = await request.json();
    const { name, description, components, rent, images } = body;

    if (!name || !description || !components || !rent) {
      return NextResponse.json(
        { success: false, error: 'Name, description, components, and rent are required' },
        { status: 400 }
      );
    }

    if (!blockId) {
      return NextResponse.json(
        { success: false, error: 'Block ID is required' },
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

    const roomType = await RoomType.create({
      name,
      description,
      components,
      rent: parseFloat(rent),
      blockId,
      images: images || [],
    });

    // Populate the components for response
    await roomType.populate('components', 'name description');

    return NextResponse.json({ success: true, data: roomType }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
