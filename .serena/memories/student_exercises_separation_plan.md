# Student Exercises - Separation of Concerns Plan

## Current Issues
- Single page.tsx file is too long (~1150+ lines)
- Multiple responsibilities mixed in one file
- Vocabulary exercise components embedded inline
- Business logic mixed with UI components

## Separation Strategy

### 1. Core Components to Extract
- `VocabularyMultipleChoice` → `/components/exercises/VocabularyMultipleChoice.tsx`
- `VocabularyFillBlanks` → `/components/exercises/VocabularyFillBlanks.tsx` 
- `VocabularyMatching` → `/components/exercises/VocabularyMatching.tsx`
- `VocabularyPronunciation` → `/components/exercises/VocabularyPronunciation.tsx`

### 2. Business Logic to Extract
- `generateVocabularyExercises()` → `/hooks/useExerciseGenerator.ts`
- Exercise data processing → `/utils/exerciseUtils.ts`
- Exercise sections config → `/config/exerciseSections.ts`

### 3. UI Components to Extract
- Section navigation → `/components/exercises/ExerciseSectionNav.tsx`
- Exercise renderer → `/components/exercises/ExerciseRenderer.tsx`
- Progress tracking → `/components/exercises/ExerciseProgress.tsx`

### 4. Final Structure
```
src/
├── app/unit2/student-exercises/
│   └── page.tsx (main orchestrator only)
├── components/exercises/
│   ├── VocabularyMultipleChoice.tsx
│   ├── VocabularyFillBlanks.tsx
│   ├── VocabularyMatching.tsx
│   ├── VocabularyPronunciation.tsx
│   ├── ExerciseSectionNav.tsx
│   ├── ExerciseRenderer.tsx
│   └── ExerciseProgress.tsx
├── hooks/
│   └── useExerciseGenerator.ts
├── utils/
│   └── exerciseUtils.ts
└── config/
    └── exerciseSections.ts
```

## Benefits
- Single Responsibility Principle enforced
- Reusable components across different units
- Easier testing and maintenance
- Clear separation of UI, business logic, and configuration