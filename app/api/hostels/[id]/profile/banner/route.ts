import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose/connection';
import { HostelProfile } from '@/lib/mongoose/models/hostel-profile.model';
import { deleteImage } from '@/lib/cloudinary';

export async function DELETE(
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

    if (!profile.media.banner?.publicId) {
      return NextResponse.json(
        { success: false, error: 'No banner to delete' },
        { status: 400 }
      );
    }

    // Delete from Cloudinary
    await deleteImage(profile.media.banner.publicId);

    // Remove banner from database
    profile.media.banner = undefined;
    await profile.save();

    return NextResponse.json({ success: true, data: profile });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
