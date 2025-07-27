# 🚀 Scaling Guide: Multiple Units & Grades

This guide shows you how to add more units (3,4,5,6...) and different grades (7,8,9...) to your curriculum database.

## 📚 **Adding More Units to Grade 6**

### Quick Commands

```bash
cd scripts

# Add Unit 3 to Grade 6
node import-unit-data.js "../_resouces/english_global_success/grade-6/3"

# Add Units 3, 4, 5, 6 in batch
npm run batch:units 3,4,5,6

# Add ALL units in Grade 6
npm run batch:grade6

# Test first with dry-run
npm run batch:grade6:dry
```

### File Structure Expected
```
_resouces/english_global_success/grade-6/
├── 2/
│   └── json/
│       ├── 01.json    # ✅ Already imported
│       ├── 02.json
│       └── ...
├── 3/
│   └── json/           # 🎯 Ready to import  
│       ├── 01.json
│       ├── 02.json
│       └── ...
├── 4/
│   └── json/           # 🎯 Ready to import
└── ...
```

## 🎓 **Adding Different Grades (7, 8, 9...)**

### Grade 7 Example

```bash
# Import Unit 1 of Grade 7
node import-unit-data.js "../_resouces/english_global_success/grade-7/1"

# Import ALL units of Grade 7
node import-multiple-units.js grade-7 --all

# Test first
node import-multiple-units.js grade-7 --all --dry-run
```

### File Structure for Multiple Grades
```
_resouces/english_global_success/
├── grade-6/
│   ├── 1/json/
│   ├── 2/json/        # ✅ Already done
│   ├── 3/json/        # 🎯 Ready
│   └── ...
├── grade-7/           # 🆕 New grade
│   ├── 1/json/
│   ├── 2/json/
│   └── ...
├── grade-8/           # 🆕 Another grade
│   ├── 1/json/
│   └── ...
```

## 🔄 **Updating Existing Data**

When you modify your JSON files and want to update the database:

### Smart Updates (Recommended)
```bash
# Check what changed (no import)
node update-curriculum.js "../_resouces/english_global_success/grade-6/2" --check-changes

# Update only if changes detected
node update-curriculum.js "../_resouces/english_global_success/grade-6/2"

# Force update regardless
node update-curriculum.js "../_resouces/english_global_success/grade-6/2" --force-update
```

### Batch Updates
```bash
# Update all existing units in Grade 6
npm run batch:update
```

## 📊 **Real Usage Examples**

### Scenario 1: You have Units 3-6 ready for Grade 6
```bash
# Test first
node import-multiple-units.js grade-6 --units 3,4,5,6 --dry-run

# Import for real
node import-multiple-units.js grade-6 --units 3,4,5,6

# Verify
npm run verify
```

### Scenario 2: You have complete Grade 7 curriculum
```bash
# Import entire Grade 7
node import-multiple-units.js grade-7 --all --dry-run
node import-multiple-units.js grade-7 --all

# Verify specific grade data
SELECT c.name, c.grade_level, COUNT(u.id) as unit_count 
FROM curricula c 
LEFT JOIN units u ON c.id = u.curriculum_id 
WHERE c.grade_level = 7 
GROUP BY c.id, c.name, c.grade_level;
```

### Scenario 3: You updated Unit 2 JSON files
```bash
# Smart update - only imports if files changed
node update-curriculum.js "../_resouces/english_global_success/grade-6/2"

# Or using npm script
npm run update:unit2
```

## 🎛️ **Advanced Features**

### Change Detection
The system tracks file hashes to detect changes:
- ✅ **Smart Updates**: Only imports when content actually changes
- ✅ **Timestamp Tracking**: See when each file was last updated  
- ✅ **Conflict Resolution**: Handles duplicate data gracefully

### Error Handling
- ✅ **Partial Failures**: Continues importing even if some items fail
- ✅ **Detailed Logging**: See exactly what succeeded/failed
- ✅ **Safe Retries**: Run multiple times without duplicates

### Performance Optimization  
- ✅ **Batch Operations**: Efficient database operations
- ✅ **Foreign Key Optimization**: Imports in dependency order
- ✅ **Index Usage**: Fast queries with proper indexing

## 🛠️ **Database Schema Benefits**

The schema supports unlimited scaling:

```sql
-- Multiple curricula per grade
curricula (grade_level, name, version)

-- Multiple units per curriculum  
units (curriculum_id, unit_number, title)

-- Rich content per unit
vocabulary (unit_id, word, enriched_learning)
exercises (unit_id, type, difficulty_level)
speaking_tasks (unit_id, lesson_number)
-- etc.
```

## 🔍 **Verification & Testing**

After importing new content:

```bash
# Quick verification
npm run verify

# Full verification with statistics
npm run verify:full

# Check specific grade/unit
SELECT 
  c.name,
  c.grade_level,
  u.unit_number,
  u.title,
  COUNT(v.id) as vocab_count,
  COUNT(e.id) as exercise_count
FROM curricula c
JOIN units u ON c.id = u.curriculum_id
LEFT JOIN vocabulary v ON u.id = v.unit_id  
LEFT JOIN exercises e ON u.id = e.unit_id
WHERE c.grade_level = 6
GROUP BY c.id, c.name, c.grade_level, u.unit_number, u.title
ORDER BY u.unit_number;
```

## 📋 **Cheat Sheet**

| Task | Command |
|------|---------|
| **Add Unit 3** | `node import-unit-data.js "../_resouces/english_global_success/grade-6/3"` |
| **Add Units 3-6** | `npm run batch:units 3,4,5,6` |
| **Add All Grade 6** | `npm run batch:grade6` |
| **Add Grade 7** | `node import-multiple-units.js grade-7 --all` |
| **Update Unit 2** | `npm run update:unit2` |
| **Check Changes** | `npm run update:check` |
| **Force Update** | `npm run update:force` |
| **Verify Data** | `npm run verify` |

## 🎯 **Pro Tips**

1. **Always test with `--dry-run` first**
2. **Use batch imports for multiple units**  
3. **Use smart updates for changed content**
4. **Verify data after each major import**
5. **Check the logs for any warnings or errors**

Your curriculum system is now **infinitely scalable**! 🚀