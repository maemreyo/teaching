#!/usr/bin/env node

/**
 * Unit Data Import Script
 * Imports enriched curriculum JSON data into Supabase
 * 
 * Usage: node import-unit-data.js [unit-path] [--dry-run]
 * Example: node import-unit-data.js "_resouces/english_global_success/grade-6/2" --dry-run
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dudgwrozqlyzpnouqdot.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.NEXT_PUBLIC_SERVICE_ROLE_KEY;;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ NEXT_PUBLIC_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Utility functions
const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  warning: (msg) => console.log(`⚠️  ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  step: (step, total, msg) => console.log(`[${step}/${total}] ${msg}`)
};

class UnitDataImporter {
  constructor(unitPath, options = {}) {
    this.unitPath = path.resolve(unitPath);
    this.jsonPath = path.join(this.unitPath, 'json');
    this.dryRun = options.dryRun || false;
    this.stats = {
      processed: 0,
      inserted: 0,
      errors: 0,
      skipped: 0
    };
  }

  async importUnit() {
    try {
      log.info('🚀 Starting Unit Data Import...');
      log.info(`📁 Unit Path: ${this.unitPath}`);
      log.info(`🔧 Mode: ${this.dryRun ? 'DRY RUN' : 'LIVE IMPORT'}`);
      
      // Verify paths exist
      await this.verifyPaths();
      
      // Import data in correct order (respecting foreign key dependencies)
      await this.importInOrder();
      
      // Show final statistics
      this.showStats();
      
    } catch (error) {
      log.error(`Import failed: ${error.message}`);
      throw error;
    }
  }

  async verifyPaths() {
    log.step(1, 8, 'Verifying paths...');
    
    try {
      await fs.access(this.unitPath);
      await fs.access(this.jsonPath);
    } catch (error) {
      throw new Error(`Invalid path: ${error.message}`);
    }
    
    // Check for JSON files
    const files = await fs.readdir(this.jsonPath);
    const jsonFiles = files.filter(f => f.endsWith('.json')).sort();
    
    if (jsonFiles.length === 0) {
      throw new Error('No JSON files found in the specified path');
    }
    
    log.success(`Found ${jsonFiles.length} JSON files: ${jsonFiles.join(', ')}`);
  }

  async importInOrder() {
    // Import in dependency order to respect foreign keys
    const importSteps = [
      { step: 2, method: 'importCurriculumAndUnits', file: '01.json', desc: 'Curriculum & Units' },
      { step: 3, method: 'importVocabulary', file: '02.json', desc: 'Vocabulary' },
      { step: 4, method: 'importGrammar', file: '03.json', desc: 'Grammar Rules' },
      { step: 5, method: 'importFunctionsAndPronunciation', file: '04.json', desc: 'Language Functions & Pronunciation' },
      { step: 6, method: 'importCulturalNotes', file: '05.json', desc: 'Cultural Notes' },
      { step: 7, method: 'importExercises', files: ['06.json', '07.json'], desc: 'Exercises' },
      { step: 8, method: 'importSkillTasks', files: ['08.json', '09.json', '10.json'], desc: 'Speaking/Listening/Writing Tasks' }
    ];

    for (const { step, method, file, files, desc } of importSteps) {
      log.step(step, 8, `Importing ${desc}...`);
      
      try {
        if (files) {
          await this[method](files);
        } else {
          await this[method](file);
        }
        log.success(`${desc} imported successfully`);
      } catch (error) {
        log.error(`Failed to import ${desc}: ${error.message}`);
        this.stats.errors++;
      }
    }
  }

  async loadJsonFile(filename) {
    const filePath = path.join(this.jsonPath, filename);
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  }

  async importCurriculumAndUnits(filename) {
    const data = await this.loadJsonFile(filename);
    
    // Import curriculum
    if (data.curriculum) {
      const curriculum = {
        name: data.curriculum.name,
        version: data.curriculum.version,
        grade_level: data.curriculum.grade_level,
        target_cefr_level: data.curriculum.target_cefr_level,
        content_language: data.curriculum.content_language,
        total_units: data.curriculum.total_units,
        is_active: true
      };

      if (!this.dryRun) {
        const { data: curriculumResult, error } = await supabase
          .from('curricula')
          .upsert(curriculum, { onConflict: 'name,version,grade_level' })
          .select()
          .single();

        if (error) throw error;
        this.curriculumId = curriculumResult.id;
      }
      
      this.stats.processed++;
      log.info(`  📚 Added curriculum: ${curriculum.name}`);
    }

    // Import units
    if (data.units && data.units.length > 0) {
      for (const unit of data.units) {
        const unitData = {
          unit_number: unit.unit_number,
          title: unit.title,
          description: unit.description,
          curriculum_id: this.curriculumId,
          themes: unit.themes || [],
          estimated_duration: unit.estimated_duration
        };

        if (!this.dryRun) {
          const { data: unitResult, error } = await supabase
            .from('units')
            .upsert(unitData, { onConflict: 'unit_number' })
            .select()
            .single();

          if (error) throw error;
          this.unitId = unitResult.id;
        }
        
        this.stats.processed++;
        log.info(`  📖 Added unit: ${unit.title}`);
      }
    }
  }

  async importVocabulary(filename) {
    const data = await this.loadJsonFile(filename);
    
    if (!data.vocabulary || data.vocabulary.length === 0) return;

    for (const vocab of data.vocabulary) {
      const vocabData = {
        word: vocab.word,
        word_id: vocab.word_id,
        word_type: vocab.word_type,
        pronunciation_ipa: vocab.pronunciation_ipa,
        meaning_vietnamese: vocab.meaning_vietnamese,
        definition_english: vocab.definition_english,
        definition: vocab.definition_english, // Required field mapping
        frequency_rank: vocab.frequency_rank,
        word_family: vocab.word_family || [],
        synonyms: vocab.synonyms || [],
        collocations: vocab.collocations || [],
        tags: vocab.tags || [],
        lesson_introduced: vocab.lesson_introduced,
        difficulty_level: vocab.difficulty_level,
        unit_id: this.unitId,
        enriched_learning: vocab.enriched_learning || {}
      };

      if (!this.dryRun) {
        const { data: vocabResult, error } = await supabase
          .from('vocabulary')
          .upsert(vocabData, { 
            onConflict: 'word_id',
            ignoreDuplicates: false 
          })
          .select()
          .single();

        if (error) {
          log.warning(`  Skipping vocabulary ${vocab.word}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }

        // Import vocabulary examples
        if (vocab.examples && vocab.examples.length > 0) {
          for (const [index, example] of vocab.examples.entries()) {
            const exampleData = {
              vocabulary_id: vocabResult.id,
              sentence: example.sentence,
              translation: example.translation,
              audio_url: example.audio_url,
              order_index: index + 1
            };

            await supabase.from('vocabulary_examples').insert(exampleData);
          }
        }

        // Import enriched learning data if exists
        if (vocab.enriched_learning) {
          const enrichedData = {
            vocabulary_id: vocabResult.id,
            common_mistake: vocab.enriched_learning.common_mistake || {},
            context_corner: vocab.enriched_learning.context_corner || {},
            memory_aid: vocab.enriched_learning.memory_aid || {}
          };

          await supabase.from('vocabulary_enriched_learning').insert(enrichedData);
        }

        this.stats.inserted++;
        log.info(`  📝 Imported/Updated: ${vocab.word} (${vocab.word_id})`);
      }

      this.stats.processed++;
    }

    log.info(`  📝 Imported ${data.vocabulary.length} vocabulary items`);
  }

  async importGrammar(filename) {
    const data = await this.loadJsonFile(filename);
    
    if (!data.grammar_rules || data.grammar_rules.length === 0) return;

    for (const grammar of data.grammar_rules) {
      const grammarData = {
        title: grammar.topic,
        description: grammar.description,
        rule_type: grammar.topic || grammar.subtopic || 'general', // Fix: Add required rule_type
        grammar_id: grammar.grammar_id,
        topic: grammar.topic,
        subtopic: grammar.subtopic,
        structure: grammar.structure,
        rules: grammar.rules || [],
        difficulty_level: grammar.difficulty_level,
        lesson_introduced: grammar.lesson_introduced,
        unit_id: this.unitId,
        enriched_context: grammar.enriched_context || {},
        examples: grammar.examples || [] // Map examples to required examples column
      };

      if (!this.dryRun) {
        const { data: grammarResult, error } = await supabase
          .from('grammar_rules')
          .upsert(grammarData, { onConflict: 'grammar_id' })
          .select()
          .single();

        if (error) {
          log.warning(`  Skipping grammar ${grammar.topic}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }

        // Import grammar examples to separate table if needed
        if (grammar.examples && grammar.examples.length > 0) {
          for (const [index, example] of grammar.examples.entries()) {
            const exampleData = {
              grammar_rule_id: grammarResult.id,
              sentence: example.sentence,
              translation: example.translation,
              audio_url: example.audio_url,
              order_index: index + 1
            };

            // Only insert if grammar_examples table exists
            try {
              await supabase.from('grammar_examples').insert(exampleData);
            } catch (exampleError) {
              // Table might not exist, skip gracefully
              log.info(`  Note: grammar_examples table not available, examples stored in main record`);
            }
          }
        }

        // Import enriched context to separate table if needed
        if (grammar.enriched_context) {
          const enrichedData = {
            grammar_rule_id: grammarResult.id,
            common_mistake: grammar.enriched_context.common_mistake || {},
            comparison_note: grammar.enriched_context.comparison_note || {},
            pro_tip: grammar.enriched_context.pro_tip || {}
          };

          try {
            await supabase.from('grammar_enriched_context').insert(enrichedData);
          } catch (enrichedError) {
            // Table might not exist, skip gracefully
            log.info(`  Note: grammar_enriched_context table not available, context stored in main record`);
          }
        }

        this.stats.inserted++;
        log.info(`  📖 Imported/Updated: ${grammar.topic} (${grammar.grammar_id})`);
      }

      this.stats.processed++;
    }

    log.info(`  📖 Imported ${data.grammar_rules.length} grammar rules`);
  }

  async importFunctionsAndPronunciation(filename) {
    const data = await this.loadJsonFile(filename);
    
    // Import language functions
    if (data.language_functions && data.language_functions.length > 0) {
      for (const func of data.language_functions) {
        const functionData = {
          function_id: func.function_id,
          name: func.name,
          description: func.description,
          unit_id: this.unitId
        };

        if (!this.dryRun) {
          const { data: funcResult, error } = await supabase
            .from('language_functions')
            .upsert(functionData, { onConflict: 'function_id' })
            .select()
            .single();

          if (error) {
            log.warning(`  Skipping function ${func.name}: ${error.message}`);
            this.stats.skipped++;
            continue;
          }

          // Import function phrases
          if (func.phrases && func.phrases.length > 0) {
            for (const [index, phrase] of func.phrases.entries()) {
              const phraseData = {
                function_id: funcResult.id,
                phrase: phrase.phrase,
                usage: phrase.usage,
                example: phrase.example,
                translation: phrase.translation,
                audio_url: phrase.audio_url,
                enriched_usage: phrase.enriched_usage || {},
                order_index: index + 1
              };

              await supabase.from('function_phrases').insert(phraseData);
            }
          }
        }

        this.stats.processed++;
      }
      log.info(`  🗣️  Imported ${data.language_functions.length} language functions`);
    }

    // Import pronunciation focuses
    if (data.pronunciation_focuses && data.pronunciation_focuses.length > 0) {
      for (const pronun of data.pronunciation_focuses) {
        const pronunData = {
          pronunciation_id: pronun.pronunciation_id,
          focus: pronun.focus,
          description: pronun.description,
          unit_id: this.unitId
        };

        if (!this.dryRun) {
          const { data: pronunResult, error } = await supabase
            .from('pronunciation_focuses')
            .upsert(pronunData, { onConflict: 'pronunciation_id' })
            .select()
            .single();

          if (error) {
            log.warning(`  Skipping pronunciation ${pronun.focus}: ${error.message}`);
            this.stats.skipped++;
            continue;
          }

          // Import pronunciation examples
          if (pronun.examples && pronun.examples.length > 0) {
            for (const example of pronun.examples) {
              const exampleData = {
                pronunciation_focus_id: pronunResult.id,
                sound: example.sound,
                rule: example.rule,
                words: example.words || []
              };

              await supabase.from('pronunciation_examples').insert(exampleData);
            }
          }

          // Import enriched practice
          if (pronun.enriched_practice) {
            const enrichedData = {
              pronunciation_focus_id: pronunResult.id,
              articulation_guide: pronun.enriched_practice.articulation_guide || {},
              minimal_pair_drills: pronun.enriched_practice.minimal_pair_drills || []
            };

            await supabase.from('pronunciation_enriched_practice').insert(enrichedData);
          }
        }

        this.stats.processed++;
      }
      log.info(`  🔊 Imported ${data.pronunciation_focuses.length} pronunciation focuses`);
    }
  }

  async importCulturalNotes(filename) {
    const data = await this.loadJsonFile(filename);
    
    if (!data.cultural_notes || data.cultural_notes.length === 0) return;

    for (const note of data.cultural_notes) {
      const noteData = {
        note_id: note.note_id,
        topic: note.topic,
        content: note.content,
        key_points: note.key_points || [],
        discussion_questions: note.discussion_questions || [],
        unit_id: this.unitId
      };

      if (!this.dryRun) {
        const { error } = await supabase
          .from('cultural_notes')
          .upsert(noteData, { onConflict: 'note_id' });

        if (error) {
          log.warning(`  Skipping cultural note ${note.topic}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }
      }

      this.stats.processed++;
    }

    log.info(`  🌍 Imported ${data.cultural_notes.length} cultural notes`);
  }

  async importExercises(fileList) {
    const allExercises = [];
    const allQuestions = [];

    // Collect exercises from multiple files
    for (const filename of fileList) {
      const data = await this.loadJsonFile(filename);
      
      // Handle different exercise types
      if (data.grammar_exercises) {
        allExercises.push(...data.grammar_exercises.map(ex => ({ ...ex, source_type: 'grammar' })));
      }
      if (data.pronunciation_exercises) {
        allExercises.push(...data.pronunciation_exercises.map(ex => ({ ...ex, source_type: 'pronunciation' })));
      }
      if (data.standalone_exercises) {
        allExercises.push(...data.standalone_exercises.map(ex => ({ ...ex, source_type: 'standalone' })));
      }
      if (data.image_exercises) {
        allExercises.push(...data.image_exercises.map(ex => ({ ...ex, source_type: 'image' })));
      }
    }

    // Import exercises
    for (const exercise of allExercises) {
      const exerciseData = {
        exercise_id: exercise.exercise_id,
        unit_id: this.unitId,
        type: exercise.source_type,
        subtype: exercise.type,
        title: exercise.title,
        instructions: exercise.instructions,
        lesson_number: exercise.lesson_number,
        skill_focus: exercise.skill_focus,
        difficulty_level: exercise.difficulty_level,
        has_images: exercise.has_images || false,
        has_audio: false // Will be updated if audio files are found
      };

      if (!this.dryRun) {
        const { data: exerciseResult, error } = await supabase
          .from('exercises')
          .upsert(exerciseData, { onConflict: 'exercise_id' })
          .select()
          .single();

        if (error) {
          log.warning(`  Skipping exercise ${exercise.title}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }

        // Import questions
        if (exercise.questions && exercise.questions.length > 0) {
          for (const [index, question] of exercise.questions.entries()) {
            const questionData = {
              question_id: question.question_id,
              exercise_id: exerciseResult.id,
              question_text: question.question_text,
              question_type: question.question_type,
              options: question.options || [],
              correct_answer: question.correct_answer,
              points: question.points || 1,
              order_index: index + 1,
              image_description: question.image_description,
              image_placeholder: question.image_placeholder,
              audio_placeholder: question.audio_placeholder,
              learning_scaffold: question.learning_scaffold || {},
              enriched_contextual_learning: question.enriched_contextual_learning || {}
            };

            await supabase.from('exercise_questions').insert(questionData);
          }
        }
      }

      this.stats.processed++;
    }

    log.info(`  📝 Imported ${allExercises.length} exercises`);
  }

  async importSkillTasks(fileList) {
    for (const filename of fileList) {
      const data = await this.loadJsonFile(filename);
      
      // Import speaking tasks
      if (data.speaking_tasks) {
        await this.importSpeakingTasks(data.speaking_tasks);
      }
      
      // Import listening tasks
      if (data.listening_tasks) {
        await this.importListeningTasks(data.listening_tasks);
      }
      
      // Import writing lessons
      if (data.writing_lessons) {
        await this.importWritingLessons(data.writing_lessons);
      }
    }
  }

  async importSpeakingTasks(tasks) {
    for (const task of tasks) {
      const taskData = {
        task_id: task.task_id,
        unit_id: this.unitId,
        lesson_number: task.lesson_number,
        title: task.title,
        main_prompt: task.main_prompt,
        cue_questions: task.cue_questions || [],
        useful_language: task.useful_language || {},
        enriched_content: task.enriched_content || {}
      };

      if (!this.dryRun) {
        const { error } = await supabase
          .from('speaking_tasks')
          .upsert(taskData, { onConflict: 'task_id' });

        if (error) {
          log.warning(`  Skipping speaking task ${task.title}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }
      }

      this.stats.processed++;
    }
    
    log.info(`  🗣️  Imported ${tasks.length} speaking tasks`);
  }

  async importListeningTasks(tasks) {
    for (const task of tasks) {
      const taskData = {
        task_id: task.task_id,
        unit_id: this.unitId,
        lesson_number: task.lesson_number,
        title: task.title,
        audio_placeholder: task.audio_placeholder,
        audio_script: task.audio_script,
        main_questions: task.main_questions || [],
        enriched_activities: task.enriched_activities || {}
      };

      if (!this.dryRun) {
        const { error } = await supabase
          .from('listening_tasks')
          .upsert(taskData, { onConflict: 'task_id' });

        if (error) {
          log.warning(`  Skipping listening task ${task.title}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }
      }

      this.stats.processed++;
    }
    
    log.info(`  👂 Imported ${tasks.length} listening tasks`);
  }

  async importWritingLessons(lessons) {
    for (const lesson of lessons) {
      const lessonData = {
        lesson_id: lesson.lesson_id,
        unit_id: this.unitId,
        title: lesson.title,
        writing_prompt: lesson.writing_prompt || {},
        model_text: lesson.model_text,
        enriched_lesson_plan: lesson.enriched_lesson_plan || {}
      };

      if (!this.dryRun) {
        const { error } = await supabase
          .from('writing_lessons')
          .upsert(lessonData, { onConflict: 'lesson_id' });

        if (error) {
          log.warning(`  Skipping writing lesson ${lesson.title}: ${error.message}`);
          this.stats.skipped++;
          continue;
        }
      }

      this.stats.processed++;
    }
    
    log.info(`  ✍️  Imported ${lessons.length} writing lessons`);
  }

  showStats() {
    log.info('\n📊 Import Statistics:');
    log.info(`  Processed: ${this.stats.processed}`);
    log.info(`  Inserted: ${this.stats.inserted}`);
    log.info(`  Skipped: ${this.stats.skipped}`);
    log.info(`  Errors: ${this.stats.errors}`);
    
    if (this.dryRun) {
      log.warning('  This was a DRY RUN - no data was actually imported');
    } else {
      log.success('  Data import completed successfully!');
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const unitPath = args[0];
  const dryRun = args.includes('--dry-run') || args.includes('-d');

  if (!unitPath) {
    console.error(`
Usage: node import-unit-data.js <unit-path> [--dry-run]

Examples:
  node import-unit-data.js "_resouces/english_global_success/grade-6/2" --dry-run
  node import-unit-data.js "_resouces/english_global_success/grade-6/2"

Options:
  --dry-run, -d    Preview what would be imported without making changes
    `);
    process.exit(1);
  }

  try {
    const importer = new UnitDataImporter(unitPath, { dryRun });
    await importer.importUnit();
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