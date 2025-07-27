-- Insert the 12 units for Global Success Grade 6
INSERT INTO units (unit_number, title, description, is_active) VALUES
(1, 'My new school', 'Introduction to school vocabulary and asking for directions', true),
(2, 'My home', 'Learning about rooms, furniture, and describing homes', true),
(3, 'My Friends', 'Describing people, personality traits, and friendships', true),
(4, 'My neighbourhood', 'Places in the neighbourhood and giving directions', true),
(5, 'Natural wonders of the world', 'Geography, natural landmarks, and comparisons', true),
(6, 'Our Tet Holiday', 'Vietnamese traditions, celebrations, and customs', true),
(7, 'Television', 'TV programmes, entertainment, and expressing preferences', true),
(8, 'Sports and Games', 'Sports vocabulary, games, and healthy activities', true),
(9, 'Cities of the world', 'Famous cities, landmarks, and travel', true),
(10, 'Our houses in the future', 'Future predictions, technology, and home automation', true),
(11, 'Our Greener World', 'Environment, recycling, and protecting nature', true),
(12, 'Robots', 'Technology, robots, and future innovations', true);

-- Insert sample vocabulary for Unit 1 "My new school"
INSERT INTO vocabulary (unit_id, word, definition, pronunciation, part_of_speech, example_sentence, difficulty_level) 
SELECT 
    units.id,
    vocab.word,
    vocab.definition,
    vocab.pronunciation,
    vocab.part_of_speech,
    vocab.example_sentence,
    vocab.difficulty_level
FROM units,
(VALUES
    ('school', 'A place where children go to learn', '/skuːl/', 'noun', 'I go to school every day.', 1),
    ('classroom', 'A room where students have lessons', '/ˈklɑːsruːm/', 'noun', 'Our classroom is on the second floor.', 1),
    ('teacher', 'A person who teaches students', '/ˈtiːtʃər/', 'noun', 'My teacher is very kind.', 1),
    ('student', 'A person who studies at school', '/ˈstuːdənt/', 'noun', 'Every student has a uniform.', 1),
    ('library', 'A place where books are kept for reading', '/ˈlaɪbreri/', 'noun', 'The library has many interesting books.', 2),
    ('playground', 'An area where children play', '/ˈpleɪɡraʊnd/', 'noun', 'We play football in the playground.', 2),
    ('calculator', 'A device used for mathematical calculations', '/ˈkælkjuleɪtər/', 'noun', 'I use a calculator in math class.', 2),
    ('uniform', 'Special clothes worn by students', '/ˈjuːnɪfɔːrm/', 'noun', 'Our school uniform is blue and white.', 2)
) AS vocab(word, definition, pronunciation, part_of_speech, example_sentence, difficulty_level)
WHERE units.unit_number = 1;

-- Insert sample grammar rules for Unit 1
INSERT INTO grammar_rules (unit_id, title, description, rule_type, examples, exercises)
SELECT 
    units.id,
    'Present Simple Tense',
    'Used to describe habits, routines, and general facts',
    'tense',
    '[
        {"sentence": "I go to school every day.", "explanation": "Regular routine"},
        {"sentence": "She studies English.", "explanation": "General habit"},
        {"sentence": "The school starts at 8 AM.", "explanation": "General fact"}
    ]'::jsonb,
    '[
        {"question": "Transform: I (go) to school every day.", "answer": "I go to school every day.", "type": "fill_blank"},
        {"question": "Make negative: She studies math.", "answer": "She does not study math.", "type": "transformation"}
    ]'::jsonb
FROM units
WHERE units.unit_number = 1;

-- Insert sample achievements
INSERT INTO achievements (name, description, icon, criteria, points) VALUES
('First Steps', 'Complete your first lesson', '🎯', '{"type": "lesson_completed", "count": 1}', 10),
('Vocabulary Master', 'Learn 50 vocabulary words', '📚', '{"type": "vocabulary_learned", "count": 50}', 50),
('Grammar Guru', 'Master 10 grammar rules', '📝', '{"type": "grammar_mastered", "count": 10}', 100),
('Streak Keeper', 'Study for 7 days in a row', '🔥', '{"type": "daily_streak", "count": 7}', 75),
('Perfect Score', 'Get 100% in any game', '⭐', '{"type": "perfect_game", "count": 1}', 25),
('Social Learner', 'Play 5 multiplayer games', '👥', '{"type": "multiplayer_games", "count": 5}', 40);