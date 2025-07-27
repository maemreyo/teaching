#!/usr/bin/env node

/**
 * Import Verification Script
 * Verifies that curriculum data was imported correctly
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dudgwrozqlyzpnouqdot.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  section: (title) => console.log(`\n🔍 ${title}`)
};

async function verifyImport() {
  console.log('🚀 Verifying curriculum data import...\n');

  try {
    // Verify curricula
    log.section('Curricula');
    const { data: curricula, error: curriculaError } = await supabase
      .from('curricula')
      .select('*');
    
    if (curriculaError) throw curriculaError;
    log.success(`Found ${curricula.length} curricula`);
    curricula.forEach(c => log.info(`  📚 ${c.name} (Grade ${c.grade_level})`));

    // Verify units
    log.section('Units');
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('*');
    
    if (unitsError) throw unitsError;
    log.success(`Found ${units.length} units`);
    units.forEach(u => log.info(`  📖 Unit ${u.unit_number}: ${u.title}`));

    // Verify vocabulary
    log.section('Vocabulary');
    const { data: vocabulary, error: vocabError } = await supabase
      .from('vocabulary')
      .select('word, word_type, difficulty_level')
      .order('word');
    
    if (vocabError) throw vocabError;
    log.success(`Found ${vocabulary.length} vocabulary items`);
    
    const vocabByType = vocabulary.reduce((acc, v) => {
      acc[v.word_type] = (acc[v.word_type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(vocabByType).forEach(([type, count]) => {
      log.info(`  📝 ${type}: ${count} words`);
    });

    // Verify vocabulary examples
    log.section('Vocabulary Examples');
    const { data: vocabExamples, error: examplesError } = await supabase
      .from('vocabulary_examples')
      .select('*');
    
    if (examplesError) throw examplesError;
    log.success(`Found ${vocabExamples.length} vocabulary examples`);

    // Verify grammar rules
    log.section('Grammar Rules');
    const { data: grammar, error: grammarError } = await supabase
      .from('grammar_rules')
      .select('topic, subtopic, difficulty_level');
    
    if (grammarError) throw grammarError;
    log.success(`Found ${grammar.length} grammar rules`);
    grammar.forEach(g => log.info(`  📖 ${g.topic} - ${g.subtopic} (Level ${g.difficulty_level})`));

    // Verify exercises
    log.section('Exercises');
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('type, title, difficulty_level');
    
    if (exercisesError) throw exercisesError;
    log.success(`Found ${exercises.length} exercises`);
    
    const exercisesByType = exercises.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(exercisesByType).forEach(([type, count]) => {
      log.info(`  📝 ${type}: ${count} exercises`);
    });

    // Verify exercise questions
    log.section('Exercise Questions');
    const { data: questions, error: questionsError } = await supabase
      .from('exercise_questions')
      .select('question_type, points')
      .order('question_type');
    
    if (questionsError) throw questionsError;
    log.success(`Found ${questions.length} exercise questions`);
    
    const questionsByType = questions.reduce((acc, q) => {
      acc[q.question_type] = (acc[q.question_type] || 0) + 1;
      return acc;
    }, {});
    
    Object.entries(questionsByType).forEach(([type, count]) => {
      log.info(`  ❓ ${type}: ${count} questions`);
    });

    // Verify language functions
    log.section('Language Functions');
    const { data: functions, error: functionsError } = await supabase
      .from('language_functions')
      .select('name');
    
    if (functionsError) throw functionsError;
    log.success(`Found ${functions.length} language functions`);
    functions.forEach(f => log.info(`  🗣️  ${f.name}`));

    // Verify pronunciation focuses
    log.section('Pronunciation');
    const { data: pronunciation, error: pronunError } = await supabase
      .from('pronunciation_focuses')
      .select('focus');
    
    if (pronunError) throw pronunError;
    log.success(`Found ${pronunciation.length} pronunciation focuses`);
    pronunciation.forEach(p => log.info(`  🔊 ${p.focus}`));

    // Verify cultural notes
    log.section('Cultural Notes');
    const { data: cultural, error: culturalError } = await supabase
      .from('cultural_notes')
      .select('topic');
    
    if (culturalError) throw culturalError;
    log.success(`Found ${cultural.length} cultural notes`);
    cultural.forEach(c => log.info(`  🌍 ${c.topic}`));

    // Verify speaking tasks
    log.section('Speaking Tasks');
    const { data: speaking, error: speakingError } = await supabase
      .from('speaking_tasks')
      .select('title');
    
    if (speakingError) throw speakingError;
    log.success(`Found ${speaking.length} speaking tasks`);
    speaking.forEach(s => log.info(`  🗣️  ${s.title}`));

    // Verify listening tasks
    log.section('Listening Tasks');
    const { data: listening, error: listeningError } = await supabase
      .from('listening_tasks')
      .select('title');
    
    if (listeningError) throw listeningError;
    log.success(`Found ${listening.length} listening tasks`);
    listening.forEach(l => log.info(`  👂 ${l.title}`));

    // Verify writing lessons
    log.section('Writing Lessons');
    const { data: writing, error: writingError } = await supabase
      .from('writing_lessons')
      .select('title');
    
    if (writingError) throw writingError;
    log.success(`Found ${writing.length} writing lessons`);
    writing.forEach(w => log.info(`  ✍️  ${w.title}`));

    // Summary
    log.section('Summary');
    const totalItems = curricula.length + units.length + vocabulary.length + 
                      grammar.length + exercises.length + questions.length +
                      functions.length + pronunciation.length + cultural.length +
                      speaking.length + listening.length + writing.length;
    
    log.success(`Total imported items: ${totalItems}`);
    log.success('All data verification checks passed! 🎉');

    // Test some complex queries
    log.section('Complex Query Tests');
    
    // Test vocabulary with examples
    const { data: vocabWithExamples, error: complexError1 } = await supabase
      .from('vocabulary')
      .select(`
        word,
        word_type,
        vocabulary_examples(sentence, translation)
      `)
      .limit(3);
    
    if (complexError1) throw complexError1;
    log.success(`✅ Vocabulary with examples query works (${vocabWithExamples.length} items)`);

    // Test exercises with questions
    const { data: exercisesWithQuestions, error: complexError2 } = await supabase
      .from('exercises')
      .select(`
        title,
        type,
        exercise_questions(question_text, correct_answer)
      `)
      .limit(2);
    
    if (complexError2) throw complexError2;
    log.success(`✅ Exercises with questions query works (${exercisesWithQuestions.length} items)`);

    log.info('\n🎯 Your curriculum data is ready for use in the application!');

  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    process.exit(1);
  }
}

// Run verification
verifyImport();