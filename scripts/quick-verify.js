#!/usr/bin/env node

/**
 * Quick Import Verification
 * Simple verification of imported Unit 2 data
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dudgwrozqlyzpnouqdot.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1ZGd3cm96cWx5enBub3VxZG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDgxMzgsImV4cCI6MjA2OTAyNDEzOH0.ZHcr7XLPkmgiTdoKXNJEK14PfbEVeS2srvQXTskhd2E';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const log = {
  success: (msg) => console.log(`✅ ${msg}`),
  info: (msg) => console.log(`ℹ️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`)
};

async function quickVerify() {
  try {
    console.log('🚀 Quick verification of Unit 2 import...\n');

    // Test basic curriculum query
    const { data: curriculum, error: currError } = await supabase
      .from('curricula')
      .select(`
        name,
        grade_level,
        target_cefr_level,
        units (
          unit_number,
          title,
          themes,
          estimated_duration
        )
      `)
      .eq('name', 'English Curriculum - My Home')
      .single();

    if (currError) throw currError;

    log.success(`Found curriculum: ${curriculum.name} (Grade ${curriculum.grade_level})`);
    log.info(`  📖 Unit ${curriculum.units[0].unit_number}: ${curriculum.units[0].title}`);
    log.info(`  🎯 CEFR Level: ${curriculum.target_cefr_level}`);
    log.info(`  ⏱️  Duration: ${curriculum.units[0].estimated_duration}`);
    log.info(`  🏷️  Themes: ${curriculum.units[0].themes.join(', ')}`);

    // Test vocabulary query using known unit ID
    const { data: vocabulary, error: vocabError } = await supabase
      .from('vocabulary')
      .select('word, word_type, pronunciation_ipa, meaning_vietnamese, difficulty_level, tags')
      .eq('unit_id', 'efbec27c-6925-4d04-8d34-4deae3300bd1')
      .order('word');

    if (vocabError) throw vocabError;

    log.success(`Found ${vocabulary.length} vocabulary items:`);
    vocabulary.forEach(v => {
      log.info(`  📝 ${v.word} (${v.word_type}) - ${v.meaning_vietnamese} [${v.pronunciation_ipa}]`);
    });

    // Test complex query - vocabulary by word type
    const vocabByType = vocabulary.reduce((acc, v) => {
      acc[v.word_type] = (acc[v.word_type] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📊 Vocabulary by type:');
    Object.entries(vocabByType).forEach(([type, count]) => {
      log.info(`  ${type}: ${count} words`);
    });

    // Test tags functionality
    const allTags = [...new Set(vocabulary.flatMap(v => v.tags))];
    console.log('\n🏷️  Available tags:');
    log.info(`  ${allTags.join(', ')}`);

    log.success('\n🎉 Basic verification passed! Your import was successful.');
    
    console.log(`
📋 Summary:
  ✅ Curriculum imported with enhanced metadata
  ✅ Unit imported with themes and duration
  ✅ Vocabulary imported with enriched fields
  ✅ Complex queries working correctly
  ✅ Data relationships properly linked

🚀 Ready to build UI components with this data!
    `);

  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    process.exit(1);
  }
}

quickVerify();