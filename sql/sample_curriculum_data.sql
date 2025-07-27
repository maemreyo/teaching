-- Sample Curriculum Data based on schema.sample structure
-- Insert Global Success Grade 6 curriculum

-- Insert curriculum
INSERT INTO curricula (name, version, target_cefr_level, content_language, total_units, grade_level) 
VALUES ('Global Success Grade 6', '2024', 'A1-A2', 'en-vi', 12, 6);

-- Get the curriculum ID for Grade 6
DO $$
DECLARE
    curriculum_grade6_id UUID;
    unit1_id UUID;
    vocab1_id UUID;
    grammar1_id UUID;
    function1_id UUID;
    dialogue1_id UUID;
    pron1_id UUID;
BEGIN
    -- Get curriculum ID
    SELECT id INTO curriculum_grade6_id FROM curricula WHERE grade_level = 6 AND name = 'Global Success Grade 6';
    
    -- Update existing Unit 1 with curriculum link and enhanced data
    UPDATE units SET 
        curriculum_id = curriculum_grade6_id,
        description = 'Introducing school subjects, facilities, and activities',
        themes = ARRAY['school', 'education', 'subjects', 'facilities'],
        estimated_duration = '8_lessons'
    WHERE unit_number = 1;
    
    -- Get Unit 1 ID
    SELECT id INTO unit1_id FROM units WHERE unit_number = 1;
    
    -- Update existing vocabulary with enhanced structure
    UPDATE vocabulary SET
        word_id = 'vocab_1_001',
        word_type = 'noun',
        pronunciation_ipa = '/ˈklɑːsruːm/',
        meaning_vietnamese = 'phòng học',
        definition_english = 'A room where classes are taught in a school',
        frequency_rank = 'high',
        word_family = ARRAY['class', 'classmate', 'classify'],
        synonyms = ARRAY['room', 'class'],
        collocations = ARRAY['school classroom', 'empty classroom', 'crowded classroom'],
        tags = ARRAY['school_facilities', 'noun', 'countable'],
        lesson_introduced = 1
    WHERE word = 'classroom' AND unit_id = unit1_id;
    
    -- Get vocabulary ID
    SELECT id INTO vocab1_id FROM vocabulary WHERE word = 'classroom' AND unit_id = unit1_id;
    
    -- Insert vocabulary examples
    INSERT INTO vocabulary_examples (vocabulary_id, sentence, translation, audio_url, order_index) VALUES
    (vocab1_id, 'Our classroom is very bright and modern.', 'Phòng học của chúng tôi rất sáng và hiện đại.', '/audio/sentences/classroom_example_1.mp3', 1),
    (vocab1_id, 'There are 30 desks in the classroom.', 'Có 30 bàn học trong phòng học.', '/audio/sentences/classroom_example_2.mp3', 2);
    
    -- Add more vocabulary for Unit 1
    INSERT INTO vocabulary (unit_id, word_id, word, word_type, pronunciation_ipa, meaning_vietnamese, definition_english, frequency_rank, word_family, synonyms, tags, lesson_introduced, difficulty_level) VALUES
    (unit1_id, 'vocab_1_002', 'teacher', 'noun', '/ˈtiː.tʃər/', 'giáo viên', 'A person who teaches students', 'high', ARRAY['teach', 'teaching', 'taught'], ARRAY['instructor', 'educator'], ARRAY['school_people', 'noun', 'countable'], 1, 1),
    (unit1_id, 'vocab_1_003', 'student', 'noun', '/ˈstuː.dənt/', 'học sinh', 'A person who studies at school', 'high', ARRAY['study', 'studying', 'studied'], ARRAY['pupil', 'learner'], ARRAY['school_people', 'noun', 'countable'], 1, 1),
    (unit1_id, 'vocab_1_004', 'library', 'noun', '/ˈlaɪ.brər.i/', 'thư viện', 'A place where books are kept for reading', 'medium', ARRAY['librarian', 'libraries'], ARRAY['bookroom'], ARRAY['school_facilities', 'noun', 'countable'], 2, 2),
    (unit1_id, 'vocab_1_005', 'playground', 'noun', '/ˈpleɪ.ɡraʊnd/', 'sân chơi', 'An area where children play', 'medium', ARRAY['play', 'playing', 'played'], ARRAY['playarea'], ARRAY['school_facilities', 'noun', 'countable'], 2, 2);
    
    -- Update existing grammar rule with enhanced structure
    UPDATE grammar_rules SET
        grammar_id = 'gram_1_001',
        topic = 'Present Simple Tense',
        subtopic = 'Affirmative sentences',
        description = 'Using present simple for daily routines and facts',
        structure = 'Subject + Verb (base form/s/es) + Object',
        rules = ARRAY['Add ''s'' or ''es'' to verbs with he/she/it', 'Use base form with I/you/we/they'],
        difficulty_level = 2,
        lesson_introduced = 2
    WHERE title = 'Present Simple Tense' AND unit_id = unit1_id;
    
    -- Get grammar rule ID
    SELECT id INTO grammar1_id FROM grammar_rules WHERE grammar_id = 'gram_1_001';
    
    -- Insert grammar examples
    INSERT INTO grammar_examples (grammar_rule_id, sentence, breakdown, translation, audio_url, order_index) VALUES
    (grammar1_id, 'I study English every day.', '{"subject": "I", "verb": "study", "object": "English", "time_expression": "every day"}', 'Tôi học tiếng Anh mỗi ngày.', '/audio/grammar/present_simple_ex1.mp3', 1),
    (grammar1_id, 'She goes to school by bus.', '{"subject": "She", "verb": "goes", "object": "to school", "manner": "by bus"}', 'Cô ấy đi học bằng xe buýt.', '/audio/grammar/present_simple_ex2.mp3', 2);
    
    -- Insert grammar exercises
    INSERT INTO grammar_exercises (exercise_id, grammar_rule_id, type, question, correct_answer, options, explanation) VALUES
    ('ex_1_001', grammar1_id, 'fill_blank', 'She _____ (go) to school by bus.', 'goes', ARRAY['go', 'goes', 'going', 'went'], 'Use ''goes'' because the subject is ''she'' (3rd person singular)'),
    ('ex_1_002', grammar1_id, 'multiple_choice', 'I _____ English every day.', 'study', ARRAY['study', 'studies', 'studying', 'studied'], 'Use base form ''study'' with subject ''I''');
    
    -- Insert language function
    INSERT INTO language_functions (function_id, unit_id, name, description) VALUES
    ('func_1_001', unit1_id, 'Introducing yourself and others', 'How to introduce yourself and introduce other people');
    
    -- Get function ID
    SELECT id INTO function1_id FROM language_functions WHERE function_id = 'func_1_001';
    
    -- Insert function phrases
    INSERT INTO function_phrases (function_id, phrase, usage, example, translation, audio_url, order_index) VALUES
    (function1_id, 'My name is...', 'Self introduction', 'My name is Minh. I''m 12 years old.', 'Tên tôi là... Tôi 12 tuổi.', '/audio/functions/intro_1.mp3', 1),
    (function1_id, 'This is my friend...', 'Introducing others', 'This is my friend, Lan. She''s in my class.', 'Đây là bạn tôi, Lan. Cô ấy cùng lớp với tôi.', '/audio/functions/intro_2.mp3', 2);
    
    -- Insert dialogue
    INSERT INTO dialogues (dialogue_id, function_id, title, speakers, audio_full_url) VALUES
    ('dial_1_001', function1_id, 'Meeting a new classmate', ARRAY['Student A', 'Student B'], '/audio/dialogues/dial_1_001_full.mp3');
    
    -- Get dialogue ID
    SELECT id INTO dialogue1_id FROM dialogues WHERE dialogue_id = 'dial_1_001';
    
    -- Insert dialogue lines
    INSERT INTO dialogue_lines (dialogue_id, speaker, text, translation, audio_url, order_index) VALUES
    (dialogue1_id, 'Student A', 'Hi! I''m Nam. What''s your name?', 'Chào! Tôi là Nam. Bạn tên gì?', '/audio/dialogues/dial_1_001_line_1.mp3', 1),
    (dialogue1_id, 'Student B', 'Hello Nam! I''m Linh. Nice to meet you.', 'Chào Nam! Tôi là Linh. Rất vui được gặp bạn.', '/audio/dialogues/dial_1_001_line_2.mp3', 2);
    
    -- Insert pronunciation focus
    INSERT INTO pronunciation_focuses (pronunciation_id, unit_id, focus, description) VALUES
    ('pron_1_001', unit1_id, 'Word stress in two-syllable words', 'Learning where to put stress in common school-related words');
    
    -- Get pronunciation focus ID
    SELECT id INTO pron1_id FROM pronunciation_focuses WHERE pronunciation_id = 'pron_1_001';
    
    -- Insert pronunciation examples
    INSERT INTO pronunciation_examples (pronunciation_focus_id, word, stress_pattern, ipa, audio_url, practice_words) VALUES
    (pron1_id, 'teacher', 'TEACH-er', '/ˈtiː.tʃər/', '/audio/pronunciation/teacher_stress.mp3', ARRAY['student', 'subject', 'homework', 'language']);
    
    -- Insert pronunciation exercises
    INSERT INTO pronunciation_exercises (exercise_id, pronunciation_focus_id, type, instruction, word, options, correct_answer, audio_url) VALUES
    ('pron_ex_1_001', pron1_id, 'stress_identification', 'Listen and identify which syllable is stressed', 'computer', ARRAY['COM-puter', 'com-PU-ter', 'compu-TER'], 'com-PU-ter', '/audio/pronunciation/computer_exercise.mp3');
    
    -- Insert cultural note
    INSERT INTO cultural_notes (note_id, unit_id, topic, content, key_points, discussion_questions) VALUES
    ('cult_1_001', unit1_id, 'School systems', 'Differences between Vietnamese and international school systems', 
     ARRAY['In many countries, students move between classrooms for different subjects', 'School uniforms are common in some countries but not others', 'The school day structure varies globally'],
     ARRAY['How is your school different from schools in other countries?', 'What do you like most about your school?']);
    
    -- Insert assessment
    INSERT INTO assessments (assessment_id, unit_id, type, skills_tested, total_points) VALUES
    ('assess_1_001', unit1_id, 'unit_test', ARRAY['vocabulary', 'grammar', 'reading', 'listening'], 100);
    
    -- Insert game metadata
    INSERT INTO game_metadata (unit_id, suggested_games) VALUES
    (unit1_id, '[
        {
            "game_type": "vocabulary_collector",
            "target_words": ["classroom", "teacher", "student", "subject", "library"],
            "difficulty": "easy",
            "estimated_playtime": "10_minutes"
        },
        {
            "game_type": "grammar_builder", 
            "target_grammar": "present_simple_affirmative",
            "difficulty": "medium",
            "estimated_playtime": "15_minutes"
        },
        {
            "game_type": "dialogue_adventure",
            "target_functions": ["introducing_yourself", "asking_for_information"],
            "difficulty": "medium", 
            "estimated_playtime": "20_minutes"
        }
    ]'::jsonb);
    
END $$;