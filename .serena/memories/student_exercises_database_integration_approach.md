# Student Exercises Database Integration Approach

## Key Issue Identified
- The user correctly pointed out that we should NOT hardcode vocabulary data in the local component
- We should use the existing database structure and `useVocabularyData` hook
- All vocabulary should be fetched from the Supabase database with the enhanced curriculum schema

## Current Database Structure Available
- **useVocabularyData hook**: Already exists and fetches vocabulary from database
- **Database schema**: Enhanced curriculum schema with vocabulary table
- **Unit 2 data**: JSON files with comprehensive vocabulary already exist in _resources folder

## Implementation Strategy
1. **Replace hardcoded data** with `useVocabularyData` hook calls
2. **Use database vocabulary** for all exercise types (multiple choice, fill-blanks, word matching, pronunciation)
3. **Generate exercises dynamically** from fetched database vocabulary
4. **Continue expanding fill-in-blanks** exercises using database data
5. **Maintain enriched learning content** from database enriched_learning field

## Files to Modify
- `src/app/unit2/student-exercises/page.tsx` - Replace hardcoded vocabulary with database calls
- Continue expanding fill-in-blanks section with comprehensive questions

## Database Data Source
- Use `useVocabularyData(2)` hook for Unit 2 vocabulary
- Leverage existing `vocabulary_examples` table for context sentences
- Use `enriched_learning` JSONB field for memory aids, common mistakes, context corners