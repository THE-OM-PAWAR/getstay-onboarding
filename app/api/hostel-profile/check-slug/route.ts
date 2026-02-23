import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { slug, excludeHostelId } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return NextResponse.json(
        { 
          success: false, 
          available: false,
          error: 'Slug can only contain lowercase letters, numbers, and hyphens' 
        },
        { status: 400 }
      );
    }

    // Check if slug exists (excluding current hostel if updating)
    const query: any = { slug };
    if (excludeHostelId) {
      query.hostel = { $ne: excludeHostelId };
    }

    const existingProfile = await HostelProfile.findOne(query);

    return NextResponse.json({ 
      success: true, 
      available: !existingProfile 
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
