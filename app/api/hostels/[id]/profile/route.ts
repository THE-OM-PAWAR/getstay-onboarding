import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to check if slug is available
async function isSlugAvailable(slug: string, excludeHostelId?: string): Promise<boolean> {
  const query: any = { slug };
  if (excludeHostelId) {
    query.hostel = { $ne: excludeHostelId };
  }
  const existing = await HostelProfile.findOne(query);
  return !existing;
}

// Helper function to generate unique slug
async function generateUniqueSlug(baseName: string, excludeHostelId?: string): Promise<string> {
  let slug = generateSlug(baseName);
  let counter = 1;
  
  while (!(await isSlugAvailable(slug, excludeHostelId))) {
    slug = `${generateSlug(baseName)}-${counter}`;
    counter++;
  }
  
  return slug;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const profile = await HostelProfile.findOne({ hostel: params.id });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error fetching hostel profile:', error);
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

    const body = await request.json();

    const existingProfile = await HostelProfile.findOne({ hostel: params.id });

    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile already exists. Use PUT to update.' },
        { status: 400 }
      );
    }

    // Handle slug: use provided slug or generate from name
    let slug = body.slug?.trim().toLowerCase();
    
    if (!slug) {
      // Generate slug from hostel name
      const hostelName = body.basicInfo?.name || 'hostel';
      slug = await generateUniqueSlug(hostelName);
    } else {
      // Validate provided slug
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { success: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }
      
      // Check if slug is available
      if (!(await isSlugAvailable(slug))) {
        return NextResponse.json(
          { success: false, error: 'This slug is already taken' },
          { status: 400 }
        );
      }
    }

    const profile = await HostelProfile.create({
      ...body,
      slug,
      hostel: params.id,
    });

    return NextResponse.json({ success: true, data: profile }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating hostel profile:', error);
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
    
    // Handle slug update
    if (body.slug) {
      const slug = body.slug.trim().toLowerCase();
      
      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(slug)) {
        return NextResponse.json(
          { success: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
          { status: 400 }
        );
      }
      
      // Check if slug is available (excluding current hostel)
      if (!(await isSlugAvailable(slug, params.id))) {
        return NextResponse.json(
          { success: false, error: 'This slug is already taken' },
          { status: 400 }
        );
      }
      
      body.slug = slug;
    } else {
      // If no slug provided and profile doesn't exist, generate one
      const existingProfile = await HostelProfile.findOne({ hostel: params.id });
      if (!existingProfile) {
        const hostelName = body.basicInfo?.name || 'hostel';
        body.slug = await generateUniqueSlug(hostelName, params.id);
      }
    }

    const profile = await HostelProfile.findOneAndUpdate(
      { hostel: params.id },
      body,
      { new: true, runValidators: true, upsert: true }
    );

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error updating hostel profile:', error);
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

    const profile = await HostelProfile.findOneAndDelete({ hostel: params.id });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Error deleting hostel profile:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
