# Curriculum Data Import Scripts

Easy-to-use scripts for importing enriched curriculum JSON data into Supabase.

## Quick Start

1. **Install dependencies:**
   ```bash
   cd scripts
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Test import (dry-run):**
   ```bash
   npm run import:unit2:dry
   ```

4. **Import Unit 2 data:**
   ```bash
   npm run import:unit2
   ```

## Features

✅ **Smart Import Order** - Respects foreign key dependencies  
✅ **Comprehensive Coverage** - Handles all 10 JSON file types  
✅ **Enriched Content** - Imports all learning aids and scaffolding  
✅ **Error Handling** - Graceful error handling with detailed logging  
✅ **Dry Run Mode** - Preview changes before importing  
✅ **Progress Tracking** - Real-time progress and statistics  
✅ **Upsert Strategy** - Safe to run multiple times  

## Usage

### Basic Commands

```bash
# Import specific unit with dry-run
node import-unit-data.js "_resouces/english_global_success/grade-6/2" --dry-run

# Import specific unit (live)
node import-unit-data.js "_resouces/english_global_success/grade-6/2"

# Using npm scripts
npm run import:unit2:dry    # Dry run for Unit 2
npm run import:unit2        # Live import for Unit 2
```

### Import Process

The script imports data in the correct dependency order:

1. **Curriculum & Units** (01.json) - Basic structure
2. **Vocabulary** (02.json) - Words with enriched learning
3. **Grammar Rules** (03.json) - Grammar with enriched context
4. **Language Functions & Pronunciation** (04.json) - Communication skills
5. **Cultural Notes** (05.json) - Cultural context
6. **Exercises** (06.json, 07.json) - Grammar and image exercises
7. **Skill Tasks** (08.json, 09.json, 10.json) - Speaking, listening, writing

### What Gets Imported

#### Core Content
- ✅ Curriculum metadata and units
- ✅ Vocabulary with pronunciation, meanings, examples
- ✅ Grammar rules with examples and exercises
- ✅ Language functions with phrases and usage

#### Enriched Learning Content
- ✅ Common mistakes with corrections
- ✅ Memory aids and context corners
- ✅ Learning scaffolds with hints and feedback
- ✅ Cultural insights and discussion questions

#### Exercise Types
- ✅ Grammar transformation and completion exercises
- ✅ Pronunciation discrimination exercises
- ✅ Image-based contextual exercises
- ✅ Reading comprehension with scaffolding
- ✅ Speaking tasks with role-play scenarios
- ✅ Listening tasks with pre/post activities
- ✅ Writing lessons with complete lesson plans

#### Advanced Features
- ✅ Audio and image placeholders
- ✅ Articulation guides for pronunciation
- ✅ Minimal pair drills
- ✅ Extended vocabulary for advanced learners
- ✅ Peer review checklists for writing

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Error Handling

- **Graceful Failures**: Continues importing even if individual items fail
- **Detailed Logging**: Shows exactly what succeeded and what failed
- **Skip Strategy**: Automatically skips duplicate or problematic entries
- **Statistics**: Provides comprehensive import statistics

## Example Output

```
🚀 Starting Unit Data Import...
📁 Unit Path: /path/to/unit/2
🔧 Mode: LIVE IMPORT

[1/8] Verifying paths...
✅ Found 10 JSON files: 01.json, 02.json, 03.json, 04.json, 05.json, 06.json, 07.json, 08.json, 09.json, 10.json

[2/8] Importing Curriculum & Units...
  📚 Added curriculum: English Curriculum - My Home
  📖 Added unit: My Home
✅ Curriculum & Units imported successfully

[3/8] Importing Vocabulary...
  📝 Processed 10 vocabulary items...
  📝 Processed 20 vocabulary items...
  📝 Imported 24 vocabulary items
✅ Vocabulary imported successfully

[4/8] Importing Grammar Rules...
  📖 Imported 2 grammar rules
✅ Grammar Rules imported successfully

...

📊 Import Statistics:
  Processed: 156
  Inserted: 154  
  Skipped: 2
  Errors: 0
✅ Data import completed successfully!
```

## Troubleshooting

**Missing environment variables:**
- Make sure `.env` file exists and contains valid Supabase credentials

**Permission errors:**
- Ensure you're using the service role key, not the anon key

**Path not found:**
- Check that the JSON files exist in the specified directory
- Use relative paths from the scripts directory

**Foreign key errors:**
- The script imports in dependency order, but manual data cleanup might be needed

## Next Steps

After importing:
1. Verify data in Supabase dashboard
2. Test queries with the provided verification script
3. Start building UI components with the imported data