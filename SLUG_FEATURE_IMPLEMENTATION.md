# Hostel Profile Slug Feature Implementation

## Overview
Added a unique slug field to hostel profiles that serves as a URL-friendly identifier for each hostel. The slug field is optional to maintain backward compatibility with existing profiles.

## Changes Made

### 1. Database Model Updates
**File:** `lib/mongoose/models/hostel-profile.model.ts`
- Added `slug` field to `IHostelProfile` interface (optional)
- Added slug schema with validation:
  - Optional field (for backward compatibility)
  - Unique index with sparse option (allows multiple null values)
  - Lowercase only
  - Regex validation: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
  - Only allows lowercase letters, numbers, and hyphens

### 2. API Endpoints

#### New Endpoint: Check Slug Availability
**File:** `app/api/hostel-profile/check-slug/route.ts`
- POST endpoint to check if a slug is available
- Validates slug format
- Excludes current hostel when checking (for updates)
- Returns `{ success: true, available: boolean }`

#### Updated Endpoint: Hostel Profile CRUD
**File:** `app/api/hostel-profile/[blockId]/route.ts`
- Added helper functions:
  - `generateSlug()`: Converts name to URL-friendly slug
  - `isSlugAvailable()`: Checks if slug is unique
  - `generateUniqueSlug()`: Creates unique slug with counter if needed
- Updated POST: Validates or auto-generates slug on creation
- Updated PUT: Validates slug on update, ensures uniqueness

### 3. Frontend UI Updates
**File:** `app/hostel/[id]/profile/page.tsx`
- Added slug input field with real-time validation
- Features:
  - Manual slug entry with format validation
  - Auto-generate button (creates slug from hostel name)
  - Auto-generation for existing profiles without slugs
  - Real-time availability checking (debounced)
  - Visual feedback (green for available, red for taken)
  - Minimum 3 characters validation
  - Required field validation before save

### 4. Migration Script
**File:** `scripts/migrate-hostel-slugs.ts`
- Adds slugs to existing hostel profiles
- Ensures all generated slugs are unique
- Safe to run multiple times
- Usage: `npx tsx scripts/migrate-hostel-slugs.ts`

## Features

### Slug Generation
- Automatically converts hostel name to slug format
- Removes special characters
- Replaces spaces with hyphens
- Converts to lowercase
- Example: "Sunrise Hostel & PG" → "sunrise-hostel-pg"

### Uniqueness Guarantee
- Database-level unique index
- API-level validation before save
- Auto-increments with counter if duplicate (e.g., "hostel-1", "hostel-2")

### User Experience
- Generate button for quick slug creation
- Real-time availability checking
- Clear visual feedback
- Prevents saving with invalid or taken slugs

## Usage

### For New Hostels
1. Enter hostel name
2. Click "Generate" button to auto-create slug
3. Or manually enter a custom slug
4. System validates availability in real-time
5. Save profile

### For Existing Hostels
1. Existing profiles load normally (slug is optional)
2. When editing, slug is auto-generated from hostel name
3. Or manually add slug when editing profile
4. System ensures uniqueness
5. Optionally run migration script for bulk updates: `npx tsx scripts/migrate-hostel-slugs.ts`

## Validation Rules
- Minimum 3 characters
- Only lowercase letters (a-z)
- Only numbers (0-9)
- Only hyphens (-) as separators
- Cannot start or end with hyphen
- Must be unique across all hostels

## API Response Examples

### Check Slug Availability
```json
// Available
{
  "success": true,
  "available": true
}

// Taken
{
  "success": true,
  "available": false
}

// Invalid format
{
  "success": false,
  "available": false,
  "error": "Slug can only contain lowercase letters, numbers, and hyphens"
}
```

### Save Profile with Slug
```json
// Success
{
  "success": true,
  "data": {
    "_id": "...",
    "slug": "my-hostel",
    "basicInfo": { ... }
  }
}

// Slug taken
{
  "success": false,
  "error": "This slug is already taken"
}
```

## Future Enhancements
- Use slug in public-facing URLs (e.g., `/hostels/my-hostel-name`)
- SEO-friendly hostel pages
- Shareable links with readable URLs
- QR codes with slug-based URLs
