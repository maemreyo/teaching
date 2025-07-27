#!/usr/bin/env node

/**
 * Vocabulary Import Script using Supabase MCP
 * Imports vocabulary data from Unit 2 JSON directly using MCP tools
 * 
 * Usage: node import-vocabulary-mcp.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const UNIT_PATH = path.resolve(__dirname, '../_resouces/english_global_success/grade-6/2');
const JSON_FILE = path.join(UNIT_PATH, 'json', '02.json');
const PROJECT_ID = 'dudgwrozqlyzpnouqdot';
const UNIT_ID = 'efbec27c-6925-4d04-8d34-4deae3300bd1';

// Utility functions
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  step: (step, total, msg) => console.log(`[${step}/${total}] ${msg}`)
};

class VocabularyImporter {
  constructor() {
    this.stats = {
      processed: 0,
      inserted: 0,
      errors: 0,
      skipped: 0
    };
  }

  async importVocabulary() {
    try {
      log.info('🚀 Starting Vocabulary Import using Supabase MCP...');
      
      // Load vocabulary data
      const data = await this.loadVocabularyData();
      
      if (!data.vocabulary || data.vocabulary.length === 0) {
        log.error('No vocabulary data found');
        return;
      }

      log.info(`📚 Found ${data.vocabulary.length} vocabulary words to import`);
      
      // Import each vocabulary item
      await this.importVocabularyItems(data.vocabulary);
      
      // Show final statistics
      this.showStats();
      
    } catch (error) {
      log.error(`Import failed: ${error.message}`);
      throw error;
    }
  }

  async loadVocabularyData() {
    log.step(1, 3, 'Loading vocabulary data...');
    
    try {
      const content = await fs.readFile(JSON_FILE, 'utf8');
      const data = JSON.parse(content);
      log.success(`Loaded vocabulary data from ${JSON_FILE}`);
      return data;
    } catch (error) {
      throw new Error(`Failed to load vocabulary data: ${error.message}`);
    }
  }

  async importVocabularyItems(vocabulary) {
    log.step(2, 3, 'Importing vocabulary items...');
    
    // Process in batches to avoid overwhelming the database
    const batchSize = 5;
    for (let i = 0; i < vocabulary.length; i += batchSize) {
      const batch = vocabulary.slice(i, i + batchSize);
      
      log.info(`📝 Processing batch ${Math.floor(i/batchSize) + 1} (${batch.length} items)...`);
      
      for (const vocab of batch) {
        await this.insertVocabularyItem(vocab);
      }
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async insertVocabularyItem(vocab) {
    try {
      // Escape single quotes for SQL
      const escapeSql = (str) => str ? str.replace(/'/g, "''") : '';
      
      // Prepare enriched learning JSON (simplified for compatibility)
      const enrichedLearning = {
        common_mistake: vocab.enriched_learning?.common_mistake || {},
        context_corner: vocab.enriched_learning?.context_corner || {},
        memory_aid: vocab.enriched_learning?.memory_aid || {}
      };

      const insertSql = `
        INSERT INTO vocabulary (
          word_id, word, word_type, pronunciation_ipa, meaning_vietnamese, 
          definition_english, definition, frequency_rank, word_family, 
          synonyms, collocations, tags, lesson_introduced, difficulty_level, 
          unit_id, enriched_learning
        ) VALUES (
          '${vocab.word_id}',
          '${escapeSql(vocab.word)}',
          '${vocab.word_type}',
          '${vocab.pronunciation_ipa}',
          '${escapeSql(vocab.meaning_vietnamese)}',
          '${escapeSql(vocab.definition_english)}',
          '${escapeSql(vocab.definition_english)}',
          '${vocab.frequency_rank}',
          ARRAY[${vocab.word_family.map(w => `'${escapeSql(w)}'`).join(',')}]::text[],
          ARRAY[${vocab.synonyms.map(s => `'${escapeSql(s)}'`).join(',')}]::text[],
          ARRAY[${vocab.collocations.map(c => `'${escapeSql(c)}'`).join(',')}]::text[],
          ARRAY[${vocab.tags.map(t => `'${escapeSql(t)}'`).join(',')}]::text[],
          ${vocab.lesson_introduced},
          ${vocab.difficulty_level},
          '${UNIT_ID}',
          '${JSON.stringify(enrichedLearning).replace(/'/g, "''")}'::jsonb
        )
        ON CONFLICT (word_id) DO UPDATE SET
          word = EXCLUDED.word,
          definition = EXCLUDED.definition,
          meaning_vietnamese = EXCLUDED.meaning_vietnamese,
          pronunciation_ipa = EXCLUDED.pronunciation_ipa,
          enriched_learning = EXCLUDED.enriched_learning,
          updated_at = NOW();
      `;

      // Note: In actual implementation, this would use Supabase MCP execute_sql
      // For now, we'll generate the SQL statements for manual execution
      console.log(`-- Importing: ${vocab.word}`);
      console.log(insertSql);
      console.log('');

      this.stats.processed++;
      log.info(`  📝 Prepared import for: ${vocab.word} (${vocab.word_id})`);
      
    } catch (error) {
      log.warning(`  Skipping vocabulary ${vocab.word}: ${error.message}`);
      this.stats.skipped++;
    }
  }

  showStats() {
    log.step(3, 3, 'Import Summary');
    log.info('\n📊 Import Statistics:');
    log.info(`  Processed: ${this.stats.processed}`);
    log.info(`  Inserted: ${this.stats.inserted}`);
    log.info(`  Skipped: ${this.stats.skipped}`);
    log.info(`  Errors: ${this.stats.errors}`);
    log.success('  SQL statements generated for all vocabulary items!');
    log.info('\n💡 Next steps:');
    log.info('  1. Review the generated SQL statements above');
    log.info('  2. Execute them via Supabase MCP execute_sql');
    log.info('  3. Verify the vocabulary teaching system shows all words');
  }
}

// Main execution
async function main() {
  try {
    const importer = new VocabularyImporter();
    await importer.importVocabulary();
    process.exit(0);
  } catch (error) {
    log.error(`Import failed: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}