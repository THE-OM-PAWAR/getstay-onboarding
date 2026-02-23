# Migration Scripts

This directory contains database migration scripts for the hostel management system.

## Available Migrations

### 1. Migrate Hostel Profile City Reference

**File:** `migrate-hostel-profile-city.ts`

**Purpose:** Adds a city reference (ObjectId) to all hostel profiles that don't have one.

**Usage:**
```bash
npm run migrate:city
```

Or directly:
```bash
npx tsx scripts/migrate-hostel-profile-city.ts
```

**What it does:**
- Finds all hostel profiles without a city reference
- Adds the specified city ID (`699cb11082fdf7d673812394`) to each profile
- Verifies the city exists before migration
- Provides detailed progress and summary

**Note:** Make sure your `.env.local` file has the correct `MONGODB_URI` configured.

### 2. Migrate Hostel Slugs

**File:** `migrate-hostel-slugs.ts`

**Purpose:** Adds unique slugs to existing hostel profiles.

**Usage:**
```bash
npx tsx scripts/migrate-hostel-slugs.ts
```

## Prerequisites

- Node.js installed
- MongoDB connection configured in `.env.local`
- `tsx` package (installed as dev dependency or run via `npx`)

## Environment Variables

Ensure your `.env.local` file contains:
```
MONGODB_URI=your_mongodb_connection_string
```

## Safety

All migration scripts:
- Connect to the database safely
- Validate data before updating
- Provide detailed logging
- Handle errors gracefully
- Close connections properly
