# City Reference Feature for Hostel Profiles

## Overview

This feature adds a city reference field to hostel profiles, allowing hostels to be associated with specific cities in the database. This enables better organization, filtering, and location-based queries.

## What's New

### 1. Database Schema Changes

**Hostel Profile Model** (`lib/mongoose/models/hostel-profile.model.ts`)
- Added `city` field as an ObjectId reference to the City model
- The field is optional to support existing profiles during migration

```typescript
city?: mongoose.Types.ObjectId; // Reference to City model
```

### 2. User Interface Changes

**Profile Page** (`app/hostel/[id]/profile/page.tsx`)
- Added a new dropdown to select a city from the database
- The dropdown fetches all available cities from `/api/cities`
- When a city is selected:
  - The city reference (ObjectId) is stored in the `city` field
  - The city name and state are automatically populated in the text fields
- The existing "City Name (Text)" field is now disabled when a city is selected from the dropdown
- Shows loading state while cities are being fetched

### 3. Migration Script

**Script:** `scripts/migrate-hostel-profile-city.ts`

A migration script to add the default city ID (`699cb11082fdf7d673812394`) to all existing hostel profiles.

**Run the migration:**
```bash
npm run migrate:city
```

**What the script does:**
1. Connects to MongoDB
2. Verifies the target city exists
3. Finds all hostel profiles without a city reference
4. Updates each profile with the city ID
5. Provides detailed progress and summary

## Usage

### For New Hostel Profiles

1. Navigate to the hostel profile page
2. In the "Basic Information" section, you'll see three fields:
   - **Landmark** - Enter nearby landmark
   - **City** (dropdown) - Select a city from the list (required)
   - **City Name (Text)** - Auto-populated from dropdown selection
3. Select a city from the dropdown
4. The city name and state will be automatically filled
5. Save the profile

### For Existing Hostel Profiles

1. Run the migration script to add the default city to all existing profiles:
   ```bash
   npm run migrate:city
   ```
2. Edit individual profiles to change the city if needed

## Technical Details

### API Integration

The city dropdown fetches data from:
```
GET /api/cities
```

Response format:
```json
{
  "success": true,
  "data": [
    {
      "_id": "699cb11082fdf7d673812394",
      "name": "Mumbai",
      "slug": "mumbai",
      "state": "Maharashtra"
    }
  ]
}
```

### Data Flow

1. **Frontend**: User selects a city from dropdown
2. **State Update**: 
   - `profile.city` = selected city ID
   - `profile.basicInfo.city` = selected city name
   - `profile.basicInfo.state` = selected city state
3. **API**: Profile is saved with the city reference
4. **Database**: City ObjectId is stored in the hostel profile

### Benefits

- **Better Organization**: Hostels are properly linked to cities
- **Efficient Queries**: Can easily fetch all hostels in a specific city
- **Data Integrity**: City information is consistent across the system
- **Scalability**: Easy to add city-based features in the future

## Migration Notes

- The default city ID used in the migration is: `699cb11082fdf7d673812394`
- All existing hostels are assumed to be from this city
- You can change individual hostel cities after migration by editing their profiles
- The migration is idempotent - running it multiple times won't cause issues

## Future Enhancements

Potential improvements:
- Add city-based filtering on the hostels list page
- Show city information on hostel cards
- Add city-specific analytics
- Implement multi-city search functionality
