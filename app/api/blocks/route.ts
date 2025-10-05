import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { Block } from '@/lib/mongoose/models/block.model';
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

    const blocks = await Block.find({ hostel: hostelId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: blocks });
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

    if (!name || !hostelId) {
      return NextResponse.json(
        { success: false, error: 'Name and hostel ID are required' },
        { status: 400 }
      );
    }

    const block = await Block.create({
      name,
      description,
      hostel: hostelId,
    });

    // Create basic room components for the new block
    const basicComponents = [
      { name: "Bed", description: "Single/double bed with mattress" },
      { name: "Study Table", description: "Wooden study table with drawers" },
      { name: "Chair", description: "Comfortable study chair" },
      { name: "Almirah/Wardrobe", description: "Storage wardrobe for clothes" },
      { name: "Ceiling Fan", description: "Electric ceiling fan" },
      { name: "Tube Light", description: "LED tube light for room lighting" },
      { name: "Dustbin", description: "Small waste bin for room" },
      { name: "Mirror", description: "Wall-mounted mirror" },
      { name: "Window Curtains", description: "Privacy curtains for windows" },
      { name: "Mattress", description: "Comfortable sleeping mattress" },
      { name: "Pillow", description: "Sleeping pillow with cover" },
      { name: "Blanket", description: "Warm blanket for sleeping" },
      { name: "Study Lamp", description: "Table lamp for reading" },
      { name: "Bookshelf", description: "Small shelf for books and items" },
    ];

    // Create all basic components for this block
    const componentsToCreate = basicComponents.map(component => ({
      ...component,
      blockId: (block as any)._id.toString(),
    }));

    await RoomComponent.insertMany(componentsToCreate);

    return NextResponse.json({ success: true, data: block }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
