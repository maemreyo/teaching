-- Enhanced Curriculum Schema Migration
-- Supporting multi-grade curriculum with comprehensive content structure

-- Add curriculum management tables
CREATE TABLE curricula (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL, -- e.g., "Global Success Grade 6"
    version TEXT NOT NULL DEFAULT '2024',
    target_cefr_level TEXT, -- e.g., "A1-A2"
    content_language TEXT DEFAULT 'en-vi',
    total_units INTEGER DEFAULT 12,
    grade_level INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(name, version, grade_level)
);

-- Enhanced units table to link to curricula
ALTER TABLE units ADD COLUMN curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE;
ALTER TABLE units ADD COLUMN themes TEXT[] DEFAULT '{}';
ALTER TABLE units ADD COLUMN estimated_duration TEXT; -- e.g., "8_lessons"

-- Enhanced vocabulary table with comprehensive fields
ALTER TABLE vocabulary ADD COLUMN word_id TEXT; -- e.g., "vocab_1_001"
ALTER TABLE vocabulary ADD COLUMN word_type TEXT; -- noun, verb, adjective, etc.
ALTER TABLE vocabulary ADD COLUMN pronunciation_ipa TEXT; -- IPA pronunciation
ALTER TABLE vocabulary ADD COLUMN meaning_vietnamese TEXT;
ALTER TABLE vocabulary ADD COLUMN definition_english TEXT;
ALTER TABLE vocabulary ADD COLUMN frequency_rank TEXT DEFAULT 'medium'; -- high, medium, low
ALTER TABLE vocabulary ADD COLUMN word_family TEXT[] DEFAULT '{}';
ALTER TABLE vocabulary ADD COLUMN synonyms TEXT[] DEFAULT '{}';
ALTER TABLE vocabulary ADD COLUMN collocations TEXT[] DEFAULT '{}';
ALTER TABLE vocabulary ADD COLUMN tags TEXT[] DEFAULT '{}';
ALTER TABLE vocabulary ADD COLUMN lesson_introduced INTEGER DEFAULT 1;
ALTER TABLE vocabulary ADD COLUMN difficulty_level INTEGER DEFAULT 1;
ALTER TABLE vocabulary ADD COLUMN enriched_learning JSONB DEFAULT '{}'; -- For enhanced learning content

-- Example sentences for vocabulary
CREATE TABLE vocabulary_examples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,
    sentence TEXT NOT NULL,
    translation TEXT,
    audio_url TEXT,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enhanced grammar rules with detailed structure
ALTER TABLE grammar_rules ADD COLUMN grammar_id TEXT; -- e.g., "gram_1_001"
ALTER TABLE grammar_rules ADD COLUMN topic TEXT;
ALTER TABLE grammar_rules ADD COLUMN subtopic TEXT;
ALTER TABLE grammar_rules ADD COLUMN structure TEXT; -- grammar structure pattern
ALTER TABLE grammar_rules ADD COLUMN rules TEXT[] DEFAULT '{}';
ALTER TABLE grammar_rules ADD COLUMN difficulty_level INTEGER DEFAULT 1;
ALTER TABLE grammar_rules ADD COLUMN lesson_introduced INTEGER DEFAULT 1;
ALTER TABLE grammar_rules ADD COLUMN enriched_context JSONB DEFAULT '{}'; -- For enriched context content

-- Grammar examples with breakdowns
CREATE TABLE grammar_examples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    grammar_rule_id UUID REFERENCES grammar_rules(id) ON DELETE CASCADE NOT NULL,
    sentence TEXT NOT NULL,
    breakdown JSONB DEFAULT '{}', -- subject, verb, object analysis
    translation TEXT,
    audio_url TEXT,
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Grammar exercises
CREATE TABLE grammar_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exercise_id TEXT,
    grammar_rule_id UUID REFERENCES grammar_rules(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- fill_blank, multiple_choice, transformation
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT[] DEFAULT '{}',
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Generic exercises table for all exercise types
CREATE TABLE exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exercise_id TEXT UNIQUE NOT NULL,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- grammar, vocabulary, pronunciation, image, reading, listening, speaking, writing
    subtype TEXT, -- transformation, multiple_choice, fill_blank, etc.
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    lesson_number INTEGER DEFAULT 1,
    skill_focus TEXT, -- grammar, vocabulary, reading, etc.
    difficulty_level INTEGER DEFAULT 1,
    has_images BOOLEAN DEFAULT false,
    has_audio BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Exercise questions table
CREATE TABLE exercise_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question_id TEXT UNIQUE NOT NULL,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL, -- multiple_choice, true_false, completion, etc.
    options TEXT[] DEFAULT '{}',
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER DEFAULT 1,
    image_description TEXT, -- for image-based questions
    image_placeholder TEXT, -- image file path
    audio_placeholder TEXT, -- audio file path
    learning_scaffold JSONB DEFAULT '{}', -- hint, feedback, reinforcement_example
    enriched_contextual_learning JSONB DEFAULT '{}', -- for image exercises
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Speaking tasks table
CREATE TABLE speaking_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id TEXT UNIQUE NOT NULL,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    lesson_number INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    main_prompt TEXT NOT NULL,
    cue_questions TEXT[] DEFAULT '{}',
    useful_language JSONB DEFAULT '{}', -- vocabulary, structures
    enriched_content JSONB DEFAULT '{}', -- warm_up, follow_up, role_play, extended_vocab
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Listening tasks table
CREATE TABLE listening_tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    task_id TEXT UNIQUE NOT NULL,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    lesson_number INTEGER DEFAULT 1,
    title TEXT NOT NULL,
    audio_placeholder TEXT, -- audio file path
    audio_script TEXT, -- transcript
    main_questions JSONB DEFAULT '[]', -- array of question objects
    enriched_activities JSONB DEFAULT '{}', -- pre_listening, post_listening
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Writing lessons table
CREATE TABLE writing_lessons (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lesson_id TEXT UNIQUE NOT NULL,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    writing_prompt JSONB NOT NULL, -- instruction, cue_questions
    model_text TEXT,
    enriched_lesson_plan JSONB DEFAULT '{}', -- pre_writing, drafting, post_writing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Language functions (communicative functions)
CREATE TABLE language_functions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    function_id TEXT,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, -- e.g., "Introducing yourself and others"
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Key phrases for language functions
CREATE TABLE function_phrases (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    function_id UUID REFERENCES language_functions(id) ON DELETE CASCADE NOT NULL,
    phrase TEXT NOT NULL,
    usage TEXT, -- context of usage
    example TEXT,
    translation TEXT,
    audio_url TEXT,
    order_index INTEGER DEFAULT 1,
    enriched_usage JSONB DEFAULT '{}', -- For enriched usage data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Dialogues for language functions
CREATE TABLE dialogues (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dialogue_id TEXT,
    function_id UUID REFERENCES language_functions(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    speakers TEXT[] NOT NULL,
    audio_full_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Dialogue lines
CREATE TABLE dialogue_lines (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    dialogue_id UUID REFERENCES dialogues(id) ON DELETE CASCADE NOT NULL,
    speaker TEXT NOT NULL,
    text TEXT NOT NULL,
    translation TEXT,
    audio_url TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pronunciation focus areas
CREATE TABLE pronunciation_focuses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pronunciation_id TEXT,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    focus TEXT NOT NULL, -- e.g., "Word stress in two-syllable words"
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pronunciation examples
CREATE TABLE pronunciation_examples (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pronunciation_focus_id UUID REFERENCES pronunciation_focuses(id) ON DELETE CASCADE NOT NULL,
    sound TEXT, -- phonetic sound like /s/, /z/, /ɪz/
    rule TEXT, -- pronunciation rule description
    words TEXT[] DEFAULT '{}', -- example words for this sound
    enriched_practice JSONB DEFAULT '{}', -- For enriched practice content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pronunciation exercises
CREATE TABLE pronunciation_exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    exercise_id TEXT,
    pronunciation_focus_id UUID REFERENCES pronunciation_focuses(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- stress_identification, sound_recognition
    instruction TEXT NOT NULL,
    word TEXT,
    options TEXT[] DEFAULT '{}',
    correct_answer TEXT,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Cultural notes
CREATE TABLE cultural_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    note_id TEXT,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    content TEXT NOT NULL,
    key_points TEXT[] DEFAULT '{}',
    discussion_questions TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Assessments
CREATE TABLE assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assessment_id TEXT,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- unit_test, quiz, project
    skills_tested TEXT[] DEFAULT '{}', -- vocabulary, grammar, reading, listening
    total_points INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Assessment sections
CREATE TABLE assessment_sections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
    section_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    question_types TEXT[] DEFAULT '{}',
    order_index INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Game metadata for units
CREATE TABLE game_metadata (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE NOT NULL,
    suggested_games JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Global characters
CREATE TABLE characters (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    character_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    age INTEGER,
    description TEXT,
    avatar_url TEXT,
    voice_profile TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- System settings for audio, difficulty, etc.
CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enriched vocabulary learning content (as separate table for better querying)
CREATE TABLE vocabulary_enriched_learning (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vocabulary_id UUID REFERENCES vocabulary(id) ON DELETE CASCADE NOT NULL,
    common_mistake JSONB DEFAULT '{}', -- mistake, correction, example_mistake, example_correction
    context_corner JSONB DEFAULT '{}', -- title, note
    memory_aid JSONB DEFAULT '{}', -- title, idea
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Grammar enriched context (as separate table for better querying)
CREATE TABLE grammar_enriched_context (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    grammar_rule_id UUID REFERENCES grammar_rules(id) ON DELETE CASCADE NOT NULL,
    common_mistake JSONB DEFAULT '{}', -- title, mistake, correction, example_mistake, example_correction
    comparison_note JSONB DEFAULT '{}', -- title, comparison, example_A, example_B
    pro_tip JSONB DEFAULT '{}', -- title, tip
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Pronunciation enriched practice (as separate table for better querying)
CREATE TABLE pronunciation_enriched_practice (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    pronunciation_focus_id UUID REFERENCES pronunciation_focuses(id) ON DELETE CASCADE NOT NULL,
    articulation_guide JSONB DEFAULT '{}', -- description, visual_aid_placeholder
    minimal_pair_drills JSONB DEFAULT '[]', -- array of drill objects
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_curricula_grade_level ON curricula(grade_level);
CREATE INDEX idx_units_curriculum_id ON units(curriculum_id);
CREATE INDEX idx_vocabulary_word_id ON vocabulary(word_id);
CREATE INDEX idx_vocabulary_word_type ON vocabulary(word_type);
CREATE INDEX idx_vocabulary_frequency ON vocabulary(frequency_rank);
CREATE INDEX idx_vocabulary_difficulty ON vocabulary(difficulty_level);
CREATE INDEX idx_grammar_rules_grammar_id ON grammar_rules(grammar_id);
CREATE INDEX idx_grammar_rules_topic ON grammar_rules(topic);
CREATE INDEX idx_language_functions_function_id ON language_functions(function_id);
CREATE INDEX idx_dialogues_dialogue_id ON dialogues(dialogue_id);
CREATE INDEX idx_pronunciation_focuses_pronunciation_id ON pronunciation_focuses(pronunciation_id);
CREATE INDEX idx_cultural_notes_note_id ON cultural_notes(note_id);
CREATE INDEX idx_assessments_assessment_id ON assessments(assessment_id);
CREATE INDEX idx_characters_character_id ON characters(character_id);
CREATE INDEX idx_vocabulary_enriched_learning_vocab_id ON vocabulary_enriched_learning(vocabulary_id);
CREATE INDEX idx_grammar_enriched_context_grammar_id ON grammar_enriched_context(grammar_rule_id);
CREATE INDEX idx_pronunciation_enriched_practice_focus_id ON pronunciation_enriched_practice(pronunciation_focus_id);
CREATE INDEX idx_exercises_exercise_id ON exercises(exercise_id);
CREATE INDEX idx_exercises_unit_id ON exercises(unit_id);
CREATE INDEX idx_exercises_type ON exercises(type);
CREATE INDEX idx_exercise_questions_question_id ON exercise_questions(question_id);
CREATE INDEX idx_exercise_questions_exercise_id ON exercise_questions(exercise_id);
CREATE INDEX idx_speaking_tasks_task_id ON speaking_tasks(task_id);
CREATE INDEX idx_speaking_tasks_unit_id ON speaking_tasks(unit_id);
CREATE INDEX idx_listening_tasks_task_id ON listening_tasks(task_id);
CREATE INDEX idx_listening_tasks_unit_id ON listening_tasks(unit_id);
CREATE INDEX idx_writing_lessons_lesson_id ON writing_lessons(lesson_id);
CREATE INDEX idx_writing_lessons_unit_id ON writing_lessons(unit_id);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_curricula_updated_at BEFORE UPDATE ON curricula FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grammar_examples_updated_at BEFORE UPDATE ON grammar_examples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('audio_settings', '{"speed_options": ["0.75x", "1x", "1.25x"], "voice_types": ["us_accent", "uk_accent", "vietnamese_accent"], "audio_format": "mp3", "quality": "128kbps"}', 'Audio playback settings'),
('difficulty_levels', '{"1": "Beginner - Basic vocabulary and simple sentences", "2": "Elementary - Common phrases and basic grammar", "3": "Pre-intermediate - Complex sentences and varied vocabulary", "4": "Intermediate - Advanced grammar and idiomatic expressions", "5": "Advanced - Sophisticated language use and cultural references"}', 'Learning difficulty level definitions'),
('tags_taxonomy', '{"skill_types": ["vocabulary", "grammar", "pronunciation", "listening", "speaking", "reading", "writing"], "word_types": ["noun", "verb", "adjective", "adverb", "preposition", "conjunction"], "themes": ["school", "family", "food", "hobbies", "travel", "health", "environment", "technology"], "difficulty": ["easy", "medium", "hard"], "frequency": ["high", "medium", "low"]}', 'Content classification taxonomy');

-- Insert default characters
INSERT INTO characters (character_id, name, age, description, avatar_url, voice_profile) VALUES
('char_001', 'Minh', 12, 'A friendly Vietnamese student', '/images/characters/minh.png', 'young_male_vietnamese_accent'),
('char_002', 'Ms. Johnson', 35, 'An enthusiastic English teacher', '/images/characters/ms_johnson.png', 'adult_female_native_english'),
('char_003', 'Lan', 12, 'A curious and smart student', '/images/characters/lan.png', 'young_female_vietnamese_accent'),
('char_004', 'Mr. Brown', 40, 'A patient and kind English teacher', '/images/characters/mr_brown.png', 'adult_male_native_english');