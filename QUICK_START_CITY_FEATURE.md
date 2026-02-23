# Quick Start: City Feature

## 🚀 Get Started in 2 Steps

### Step 1: Run the Migration (One-time setup)

This adds the city reference to all existing hostel profiles:

```bash
npm run migrate:city
```

**Expected Output:**
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB
✅ Found city: [City Name], [State]

📊 Found X hostel profiles without city reference

✅ Updated profile: [Hostel Name 1]
✅ Updated profile: [Hostel Name 2]
...

📊 Migration Summary:
   Total profiles found: X
   Successfully updated: X
   Failed: 0

✅ Migration completed!
🔌 Disconnected from MongoDB
```

### Step 2: Use the Feature

1. Open any hostel profile page
2. Look for the new **City** dropdown in the Basic Information section
3. Select a city from the dropdown
4. The city name and state will auto-populate
5. Click Save

## 🎯 What You'll See

### In the Profile Form:

**Basic Information Section:**
```
┌─────────────────────────────────────────────────────┐
│ Hostel Name: [Your Hostel Name]                     │
│ Contact Number: [Phone Number]                      │
│                                                      │
│ Slug: [hostel-slug] [Generate]                      │
│                                                      │
│ Description: [Text area]                            │
│                                                      │
│ Address: [Text area]                                │
│                                                      │
│ Landmark: [Input]                                   │
│ City *: [Dropdown - Select a city] ← NEW!          │
│ City Name (Text): [Auto-filled, disabled]          │
│                                                      │
│ State: [Auto-filled]                                │
│ PIN Code: [Input]                                   │
│ Email: [Input]                                      │
└─────────────────────────────────────────────────────┘
```

### City Dropdown Options:
```
Select a city
─────────────────
Mumbai, Maharashtra
Delhi, Delhi
Bangalore, Karnataka
Pune, Maharashtra
...
```

## ✅ Verification

After running the migration, verify it worked:

1. Check the migration output for success messages
2. Open any hostel profile page
3. You should see the city dropdown populated
4. The selected city should match the default city from migration

## 🔧 Troubleshooting

### Migration fails with "City not found"
- Verify the city ID `699cb11082fdf7d673812394` exists in your database
- Check your MongoDB connection in `.env.local`

### Dropdown shows "Loading cities..."
- Check your network connection
- Verify `/api/cities` endpoint is working
- Check browser console for errors

### City field is empty after migration
- Re-run the migration script
- Check MongoDB for the city reference field

## 📞 Need Help?

Check the detailed documentation:
- `CITY_FEATURE.md` - Complete feature documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- `scripts/README.md` - Migration scripts documentation
