export interface ExerciseSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  exercises: string[];
}

export const exerciseSections: ExerciseSection[] = [
  {
    id: 'vocabulary',
    title: '📝 Vocabulary Exercises',
    description: 'Practice Unit 2 vocabulary with multiple types of exercises',
    icon: '📚',
    color: 'bg-blue-100 border-blue-300',
    exercises: ['multiple_choice', 'fill_blanks', 'word_matching', 'pronunciation']
  },
  {
    id: 'grammar',
    title: '📖 Grammar Practice',  
    description: 'Master present simple tense and sentence structures',
    icon: '✏️',
    color: 'bg-green-100 border-green-300',
    exercises: ['transformation', 'fill_blanks', 'error_correction', 'sentence_building']
  },
  {
    id: 'pronunciation',
    title: '🗣️ Pronunciation Training',
    description: 'Practice word stress and sound recognition',
    icon: '🎵',
    color: 'bg-purple-100 border-purple-300', 
    exercises: ['stress_identification', 'sound_recognition', 'minimal_pairs', 'recording_practice']
  },
  {
    id: 'language_functions',
    title: '💬 Communication Skills',
    description: 'Learn phrases for introducing yourself and others',
    icon: '🗨️',
    color: 'bg-orange-100 border-orange-300',
    exercises: ['dialogue_completion', 'phrase_matching', 'role_play_prep', 'conversation_practice']
  },
  {
    id: 'listening',
    title: '👂 Listening Comprehension',
    description: 'Understand spoken English about homes and rooms',
    icon: '🎧',
    color: 'bg-indigo-100 border-indigo-300',
    exercises: ['audio_comprehension', 'dialogue_listening', 'sound_discrimination', 'note_taking']
  },
  {
    id: 'integrated',
    title: '🎯 Integrated Skills',
    description: 'Combine vocabulary, grammar, and communication',
    icon: '🎲',
    color: 'bg-pink-100 border-pink-300',
    exercises: ['mixed_practice', 'project_tasks', 'real_world_scenarios', 'assessment_prep']
  }
];