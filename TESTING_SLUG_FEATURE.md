# Testing the Hostel Slug Feature

## Prerequisites
1. Ensure your MongoDB database is running
2. Have at least one organization and hostel created
3. Run the migration script if you have existing hostel profiles

## Test Scenarios

### 1. Test Migration Script (For Existing Hostels)

```bash
npx tsx scripts/migrate-hostel-slugs.ts
```

**Expected Result:**
- Script connects to database
- Shows count of profiles without slugs
- Updates each profile with a unique slug
- Shows success message

### 2. Test New Hostel Profile Creation

#### Steps:
1. Navigate to a hostel: `/hostel/{hostel-id}/profile`
2. Fill in the hostel name (e.g., "Sunrise Hostel")
3. Click the "Generate" button next to the slug field

**Expected Result:**
- Slug field populates with "sunrise-hostel"
- Green checkmark appears showing "✓ Available"
- You can save the profile successfully

### 3. Test Manual Slug Entry

#### Steps:
1. Navigate to hostel profile page
2. Manually type a slug (e.g., "my-custom-slug")
3. Wait for validation (500ms debounce)

**Expected Result:**
- If available: Green checkmark "✓ Available"
- If taken: Red X "✗ Taken"
- Invalid characters are automatically removed

### 4. Test Slug Uniqueness

#### Steps:
1. Create first hostel profile with slug "test-hostel"
2. Try to create another hostel profile with same slug "test-hostel"

**Expected Result:**
- Second hostel shows red X "✗ Taken"
- Cannot save until slug is changed
- Error toast appears if you try to save

### 5. Test Slug Validation

#### Test Invalid Formats:
- `Test Hostel` → Auto-converts to `test-hostel`
- `test@hostel` → Auto-converts to `testhostel`
- `TEST-HOSTEL` → Auto-converts to `test-hostel`
- `test--hostel` → Auto-converts to `test-hostel`
- `-test-` → Auto-converts to `test`

**Expected Result:**
- All special characters removed
- Spaces converted to hyphens
- Lowercase enforced
- Multiple hyphens collapsed to single hyphen

### 6. Test Minimum Length Validation

#### Steps:
1. Enter slug with less than 3 characters (e.g., "ab")

**Expected Result:**
- Red error message: "Slug must be at least 3 characters"
- Cannot save profile

### 7. Test Slug Update

#### Steps:
1. Open existing hostel profile with slug
2. Change the slug to a new available value
3. Save the profile

**Expected Result:**
- Slug updates successfully
- Old slug becomes available for other hostels
- New slug is validated for uniqueness

### 8. Test API Endpoints Directly

#### Check Slug Availability:
```bash
curl -X POST http://localhost:3000/api/hostel-profile/check-slug \
  -H "Content-Type: application/json" \
  -d '{"slug": "test-hostel"}'
```

**Expected Response:**
```json
{
  "success": true,
  "available": true
}
```

#### Create Profile with Slug:
```bash
curl -X POST http://localhost:3000/api/hostels/{hostel-id}/profile \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-hostel",
    "basicInfo": {
      "name": "My Hostel",
      "address": "123 Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "contactNumber": "1234567890",
      "email": "test@example.com"
    },
    "propertyDetails": {
      "totalFloors": 3,
      "totalRooms": 20,
      "accommodationType": "boys",
      "buildingType": "independent"
    }
  }'
```

### 9. Test Auto-Generation with Duplicates

#### Steps:
1. Create hostel "Sunrise Hostel" → slug: "sunrise-hostel"
2. Run migration or create another "Sunrise Hostel"

**Expected Result:**
- Second hostel gets slug: "sunrise-hostel-1"
- Third would get: "sunrise-hostel-2"
- And so on...

### 10. Test Edge Cases

#### Empty Name:
1. Leave hostel name empty
2. Try to generate slug

**Expected Result:**
- Generate button is disabled
- Or generates "hostel" as base slug

#### Special Characters Only:
1. Enter name: "@@@ ### $$$"
2. Generate slug

**Expected Result:**
- Generates valid slug or shows error
- Falls back to "hostel" if no valid characters

## Common Issues and Solutions

### Issue: "Slug is already taken" but no other hostel visible
**Solution:** Check database directly for orphaned profiles or run migration script

### Issue: Cannot save profile
**Solution:** 
- Ensure slug is at least 3 characters
- Ensure slug shows green checkmark (available)
- Check browser console for errors

### Issue: Migration script fails
**Solution:**
- Check MongoDB connection string in `.env`
- Ensure database is running
- Check for network/firewall issues

## Database Verification

### Check Slugs in MongoDB:
```javascript
// In MongoDB shell or Compass
db.hostelprofiles.find({}, { slug: 1, "basicInfo.name": 1 })
```

### Check for Duplicates:
```javascript
db.hostelprofiles.aggregate([
  { $group: { _id: "$slug", count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } }
])
```

**Expected Result:** Empty array (no duplicates)

### Check Profiles Without Slugs:
```javascript
db.hostelprofiles.find({
  $or: [
    { slug: { $exists: false } },
    { slug: null },
    { slug: "" }
  ]
})
```

**Expected Result:** Empty array after migration

## Success Criteria

✅ All existing hostels have unique slugs after migration
✅ New hostels can be created with custom or generated slugs
✅ Duplicate slugs are prevented at both UI and API level
✅ Invalid characters are handled gracefully
✅ Real-time validation provides clear feedback
✅ Slugs are URL-friendly and SEO-optimized
