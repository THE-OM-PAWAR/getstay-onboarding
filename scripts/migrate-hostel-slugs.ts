/**
 * Migration script to add slugs to existing hostel profiles
 * Run this script once to update all existing hostel profiles with unique slugs
 * 
 * Usage: npx tsx scripts/migrate-hostel-slugs.ts
 */

import 'dotenv/config'; // Load environment variables from .env file
import mongoose from 'mongoose';
import connectDB from '../lib/mongoose/connection';
import { HostelProfile } from '../lib/mongoose/models/hostel-profile.model';

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function migrateHostelSlugs() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Find all hostel profiles without a slug
    const profilesWithoutSlug = await HostelProfile.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`Found ${profilesWithoutSlug.length} hostel profiles without slugs`);

    if (profilesWithoutSlug.length === 0) {
      console.log('All hostel profiles already have slugs!');
      process.exit(0);
    }

    // Track used slugs to ensure uniqueness
    const usedSlugs = new Set<string>();
    
    // Get all existing slugs
    const existingProfiles = await HostelProfile.find({ 
      slug: { 
        $exists: true, 
        $nin: [null, ''] 
      } 
    });
    existingProfiles.forEach(profile => {
      if (profile.slug) {
        usedSlugs.add(profile.slug);
      }
    });

    // Update each profile
    for (const profile of profilesWithoutSlug) {
      const baseName = profile.basicInfo?.name || 'hostel';
      let slug = generateSlug(baseName);
      let counter = 1;

      // Ensure slug is unique
      while (usedSlugs.has(slug)) {
        slug = `${generateSlug(baseName)}-${counter}`;
        counter++;
      }

      usedSlugs.add(slug);

      // Update the profile
      await HostelProfile.updateOne(
        { _id: profile._id },
        { $set: { slug } }
      );

      console.log(`✓ Updated profile for "${profile.basicInfo?.name}" with slug: "${slug}"`);
    }

    console.log('\n✅ Migration completed successfully!');
    console.log(`Updated ${profilesWithoutSlug.length} hostel profiles`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run the migration
migrateHostelSlugs();
