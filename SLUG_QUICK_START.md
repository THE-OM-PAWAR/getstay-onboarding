# Hostel Slug Feature - Quick Start Guide

## What's New?
Every hostel profile now has a unique slug - a URL-friendly identifier like "sunrise-hostel" or "green-valley-pg".

## For Existing Hostels (Optional)

Your existing hostel profiles will continue to work without slugs. When you edit a profile:

1. **Slug auto-generates** from the hostel name automatically
2. **Or click "Generate"** to create a new slug
3. **Or enter custom slug** manually
4. **Save the profile** with the slug

### Bulk Migration (Optional)

To add slugs to all existing hostels at once:

```bash
npx tsx scripts/migrate-hostel-slugs.ts
```

This is optional - profiles work fine without slugs until you edit them.

## For New Hostels

When creating or editing a hostel profile:

1. **Enter the hostel name** (e.g., "Sunrise Hostel")
2. **Click "Generate"** button next to the slug field
   - This creates a slug like "sunrise-hostel"
3. **Or enter a custom slug** manually
   - Must be lowercase, numbers, and hyphens only
   - Minimum 3 characters
4. **Wait for validation** (green ✓ = available, red ✗ = taken)
5. **Save the profile**

## Slug Rules

✅ **Valid slugs:**
- `sunrise-hostel`
- `green-valley-pg`
- `hostel-123`
- `my-hostel-2024`

❌ **Invalid slugs:**
- `Sunrise Hostel` (uppercase/spaces)
- `sunrise@hostel` (special characters)
- `ab` (too short, minimum 3 chars)

## Features

- **Auto-generation**: Click "Generate" to create slug from hostel name
- **Real-time validation**: See instantly if slug is available
- **Uniqueness guarantee**: No two hostels can have the same slug
- **Auto-increment**: If "sunrise-hostel" exists, next gets "sunrise-hostel-1"

## Troubleshooting

**Q: Slug shows as "taken" but I don't see another hostel with that name?**
A: Run the migration script to check for orphaned profiles

**Q: Can I change a slug after creating it?**
A: Yes! Just edit the hostel profile and update the slug field

**Q: What happens to old URLs if I change the slug?**
A: Currently slugs are for identification only. Future updates will use them in URLs.

## Need Help?

Check the detailed documentation:
- `SLUG_FEATURE_IMPLEMENTATION.md` - Technical details
- `TESTING_SLUG_FEATURE.md` - Testing guide
- `scripts/README.md` - Migration script details
