/**
 * Migration script to add city ID to existing hostels
 * Run this script once to update all existing hostels with a city ID
 * 
 * Usage: npx tsx scripts/migrate-hostel-city.ts
 */

import 'dotenv/config'; // Load environment variables from .env file
import mongoose from 'mongoose';
import connectDB from '../lib/mongoose/connection';
import { Hostel } from '../lib/mongoose/models/hostel.model';
import { City } from '../lib/mongoose/models/city.model';

// The city ID to assign to all hostels
const DEFAULT_CITY_ID = '699ca5681a9f3ace287f8b20';

async function migrateHostelCity() {
  try {
    await connectDB();
    console.log('Connected to database');

    // Verify the city exists
    const city = await City.findById(DEFAULT_CITY_ID);
    if (!city) {
      console.error(`❌ City with ID ${DEFAULT_CITY_ID} not found in database`);
      process.exit(1);
    }
    
    console.log(`✓ Found city: ${city.name}, ${city.state}`);

    // Find all hostels without a city
    const hostelsWithoutCity = await Hostel.find({
      $or: [
        { city: { $exists: false } },
        { city: null }
      ]
    });

    console.log(`\nFound ${hostelsWithoutCity.length} hostels without a city`);

    if (hostelsWithoutCity.length === 0) {
      console.log('All hostels already have a city assigned!');
      process.exit(0);
    }

    // Update each hostel
    let successCount = 0;
    let errorCount = 0;

    for (const hostel of hostelsWithoutCity) {
      try {
        await Hostel.updateOne(
          { _id: hostel._id },
          { $set: { city: DEFAULT_CITY_ID } }
        );

        console.log(`✓ Updated hostel: "${hostel.name}" with city: ${city.name}`);
        successCount++;
      } catch (error: any) {
        console.error(`✗ Failed to update hostel "${hostel.name}":`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Migration completed!');
    console.log(`Successfully updated: ${successCount} hostels`);
    if (errorCount > 0) {
      console.log(`Failed to update: ${errorCount} hostels`);
    }
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the migration
migrateHostelCity();
