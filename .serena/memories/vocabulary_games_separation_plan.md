# VocabularyGames Component Separation Plan

## Current Structure Analysis
The VocabularyGames.tsx component is currently ~977 lines and contains:

### Core Logic (to extract)
- **Types & Interfaces**: `VocabularyWord`, `VocabularyGameProps` 
- **Common utilities**: `difficultySettings`, `getDifficultyColor`, `playAudio`, `useHint`
- **Game state management**: All useState hooks and game control logic

### Game-Specific Handlers (to separate)
1. **FlashcardGame** - `handleFlashcardAction`, flashcard JSX (lines ~607-754)
2. **QuizGame** - `handleQuizAnswer`, quiz JSX (lines ~757-829) 
3. **MatchingGame** - `handleMatchingClick`, matching JSX (lines ~832-874)
4. **MemoryGame** - `handleMemoryCardClick`, memory JSX (lines ~877-901)
5. **WordfallGame** - `handleWordfall`, wordfall JSX (lines ~904-936)
6. **TypingGame** - `handleTyping`, typing JSX (lines ~939-973)

## Separation Strategy
1. **Create shared types/utilities** in `vocabulary/types.ts` and `vocabulary/gameUtils.ts`
2. **Create individual game components** in `vocabulary/games/` directory
3. **Refactor main component** to orchestrate game selection and common state
4. **Extract game initialization logic** to each game component

## Benefits
- **Single Responsibility**: Each game component handles only its logic
- **Maintainability**: Easier to modify individual games
- **Reusability**: Games can be used independently
- **Code Organization**: Clear structure with proper separation of concerns