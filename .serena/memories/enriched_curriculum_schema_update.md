# Enriched Curriculum Schema Update

## Overview
Updated the database schema to support enriched learning content based on the generated JSON files from Unit 2 curriculum data.

## Key Schema Enhancements

### Vocabulary Enhancements
- Added `word_id`, `word_type`, `pronunciation_ipa`, `meaning_vietnamese`, `definition_english`
- Added `frequency_rank`, `word_family`, `synonyms`, `collocations`, `tags`  
- Added `lesson_introduced`, `difficulty_level`
- Added `enriched_learning` JSONB column for enhanced learning content

### Grammar Rules Enhancements
- Added `grammar_id`, `topic`, `subtopic`, `structure`
- Added `rules` array and `enriched_context` JSONB column
- Added `difficulty_level` and `lesson_introduced`

### New Tables Added
- `vocabulary_examples` - Example sentences for vocabulary
- `grammar_examples` - Grammar examples with breakdowns
- `grammar_exercises` - Grammar practice exercises
- `language_functions` - Communicative functions
- `function_phrases` - Key phrases with enriched usage data
- `dialogues` and `dialogue_lines` - Conversation content
- `pronunciation_focuses` and `pronunciation_examples` - Pronunciation practice
- `pronunciation_exercises` - Pronunciation practice exercises
- `cultural_notes` - Cultural context information
- `assessments` and `assessment_sections` - Testing content
- `characters` - Global character system
- `system_settings` - Configuration management

### Enriched Learning Tables
- `vocabulary_enriched_learning` - Common mistakes, context corners, memory aids
- `grammar_enriched_context` - Mistakes, comparisons, pro tips
- `pronunciation_enriched_practice` - Articulation guides, minimal pair drills

## Data Structure Support
The schema now supports the enriched JSON format including:
- Enhanced vocabulary with learning aids and common mistakes
- Detailed grammar rules with context and examples
- Language functions with usage patterns
- Pronunciation focus with practice drills
- Cultural notes with discussion questions

## Applied to Supabase
All migrations have been successfully applied to the edu-game-hub Supabase project (dudgwrozqlyzpnouqdot).