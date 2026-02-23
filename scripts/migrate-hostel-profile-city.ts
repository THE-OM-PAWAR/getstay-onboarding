/**
 * Migration script to add city reference to existing hostel profiles
 * This script adds the specified city ID to all hostel profiles that don't have a city reference
 * 
 * Usage: npm run migrate:city
 * Or: npx tsx scripts/migrate-hostel-profile-city.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../lib/mongoose/connection';
import { HostelProfile } from '../lib/mongoose/models/hostel-profile.model';
import { City } from '../lib/mongoose/models/city.model';

const TARGET_CITY_ID = '699ca5681a9f3ace287f8b20';

async function migrateHostelProfileCity() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Verify the city exists
    const city = await City.findById(TARGET_CITY_ID);
    if (!city) {
      console.error(`❌ City with ID ${TARGET_CITY_ID} not found`);
      process.exit(1);
    }
    console.log(`✅ Found city: ${city.name}, ${city.state}`);

    // Find all hostel profiles without a city reference
    const profiles = await HostelProfile.find({
      $or: [
        { city: { $exists: false } },
        { city: null }
      ]
    });

    console.log(`\n📊 Found ${profiles.length} hostel profiles without city reference`);

    if (profiles.length === 0) {
      console.log('✅ All hostel profiles already have city references');
      process.exit(0);
    }

    // Update each profile
    let successCount = 0;
    let errorCount = 0;

    for (const profile of profiles) {
      try {
        await HostelProfile.findByIdAndUpdate(
          profile._id,
          { 
            $set: { 
              city: new mongoose.Types.ObjectId(TARGET_CITY_ID)
            } 
          }
        );
        successCount++;
        console.log(`✅ Updated profile: ${profile.basicInfo?.name || profile._id}`);
      } catch (error: any) {
        errorCount++;
        console.error(`❌ Failed to update profile ${profile._id}:`, error.message);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   Total profiles found: ${profiles.length}`);
    console.log(`   Successfully updated: ${successCount}`);
    console.log(`   Failed: ${errorCount}`);
    console.log(`\n✅ Migration completed!`);

  } catch (error: any) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
migrateHostelProfileCity();

