# Migration Scripts

## Hostel Slug Migration

This script adds unique slugs to existing hostel profiles that don't have one.

### Prerequisites

1. Make sure you have `tsx` installed:
```bash
npm install -g tsx
```

Or use it via npx (no installation needed).

2. Ensure your `.env` file has the `MONGODB_URI` variable set:
```
MONGODB_URI=mongodb+srv://your-connection-string
```

### Running the Migration

```bash
npx tsx scripts/migrate-hostel-slugs.ts
```

The script automatically loads environment variables from your `.env` file.

### What it does

1. Connects to your MongoDB database
2. Finds all hostel profiles without a slug
3. Generates a unique slug for each profile based on the hostel name
4. If a slug already exists, it appends a number (e.g., `my-hostel-1`, `my-hostel-2`)
5. Updates all profiles with their new slugs

### Important Notes

- This script is safe to run multiple times
- It will only update profiles that don't have a slug
- All generated slugs are guaranteed to be unique
- The script will show progress for each updated profile

### Example Output

```
Connected to database
Found 5 hostel profiles without slugs
✓ Updated profile for "Sunrise Hostel" with slug: "sunrise-hostel"
✓ Updated profile for "Green Valley PG" with slug: "green-valley-pg"
✓ Updated profile for "City Center Hostel" with slug: "city-center-hostel"
✓ Updated profile for "Sunrise Hostel" with slug: "sunrise-hostel-1"
✓ Updated profile for "Student's Paradise" with slug: "students-paradise"

✅ Migration completed successfully!
Updated 5 hostel profiles
Database connection closed
```
