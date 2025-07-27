'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { VocabularyWord } from '@/hooks/useVocabularyData';

interface PhaserGameProps {
  words: VocabularyWord[];
  gameType: 'matching' | 'memory' | 'wordfall' | 'typing';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert' | 'nightmare' | 'hell';
  onScoreUpdate: (score: number) => void;
  onGameEnd: (score: number, passed: boolean) => void;
}

interface DifficultySettings {
  speed: number;
  lives: number;
  timeLimit: number;
  wordCount: number;
}

interface GameCallbacks {
  onScoreUpdate: (score: number) => void;
  onGameEnd: (score: number, passed: boolean) => void;
}

const difficultySettings: Record<string, DifficultySettings> = {
  easy: { speed: 50, lives: 5, timeLimit: 60, wordCount: 3 },
  medium: { speed: 75, lives: 4, timeLimit: 45, wordCount: 4 },
  hard: { speed: 100, lives: 3, timeLimit: 30, wordCount: 5 },
  expert: { speed: 125, lives: 2, timeLimit: 25, wordCount: 6 },
  nightmare: { speed: 150, lives: 1, timeLimit: 20, wordCount: 6 },
  hell: { speed: 200, lives: 1, timeLimit: 15, wordCount: 6 }
};

export default function VocabularyPhaserGame({ 
  words, 
  gameType, 
  difficulty, 
  onScoreUpdate, 
  onGameEnd 
}: PhaserGameProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [Phaser, setPhaser] = useState<typeof import('phaser') | null>(null);

  const settings = difficultySettings[difficulty];
  const gameWords = words.slice(0, settings.wordCount);

  // Memoize callbacks to prevent unnecessary re-renders
  const callbacks = useMemo<GameCallbacks>(() => ({
    onScoreUpdate,
    onGameEnd
  }), [onScoreUpdate, onGameEnd]);

  useEffect(() => {
    const loadPhaser = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        const PhaserModule = await import('phaser');
        const PhaserLib = PhaserModule.default || PhaserModule;
        setPhaser(() => PhaserLib);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load Phaser:', err);
        setError('Failed to load game engine');
        setIsLoading(false);
      }
    };

    loadPhaser();
  }, []);

  useEffect(() => {
    if (!Phaser || !canvasRef.current || gameRef.current || !gameStarted) return;

    try {
      // Create proper Phaser 3.60.0 scene classes
      class BaseGameScene extends Phaser.Scene {
        protected gameWords: VocabularyWord[];
        protected settings: DifficultySettings;
        protected callbacks: GameCallbacks;
        protected score: number = 0;
        protected lives: number;

        constructor(key: string, words: VocabularyWord[], settings: DifficultySettings, callbacks: GameCallbacks) {
          super({ key });
          this.gameWords = words;
          this.settings = settings;
          this.callbacks = callbacks;
          this.lives = settings.lives;
        }

        protected updateScore(points: number) {
          this.score += points;
          this.callbacks.onScoreUpdate(this.score);
        }

        protected endGame(completed: boolean) {
          this.callbacks.onGameEnd(this.score, completed);
        }
      }

      class WordFallScene extends BaseGameScene {
        private player!: Phaser.Physics.Arcade.Sprite;
        private words!: Phaser.Physics.Arcade.Group;
        private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
        private scoreText!: Phaser.GameObjects.Text;
        private livesText!: Phaser.GameObjects.Text;
        private currentWordIndex: number = 0;

        constructor(words: VocabularyWord[], settings: DifficultySettings, callbacks: GameCallbacks) {
          super('WordFallScene', words, settings, callbacks);
        }

        preload() {
          // Create simple colored rectangles for game objects
          this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
        }

        create() {
          // Background
          this.add.rectangle(400, 300, 800, 600, 0x87CEEB);

          // Player setup
          this.player = this.physics.add.sprite(400, 550, 'player');
          this.player.setDisplaySize(60, 20);
          this.player.setTint(0x00ff00);
          this.player.setCollideWorldBounds(true);

          // Words group
          this.words = this.physics.add.group();

          // Input
          this.cursors = this.input.keyboard!.createCursorKeys();

          // UI Text
          this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            color: '#000000'
          });

          this.livesText = this.add.text(16, 50, `Lives: ${this.lives}`, {
            fontSize: '24px',
            color: '#000000'
          });

          // Collision detection
          this.physics.add.overlap(this.player, this.words, this.collectWord, undefined, this);

          // Start spawning words
          this.time.addEvent({
            delay: 2000,
            callback: this.spawnWord,
            callbackScope: this,
            loop: true
          });

          // Game timer
          this.time.delayedCall(this.settings.timeLimit * 1000, () => {
            this.endGame(true);
          });
        }

        update() {
          // Player movement
          if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
          } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
          } else {
            this.player.setVelocityX(0);
          }

          // Check words that fell off screen
          this.words.children.entries.forEach((word) => {
            const wordSprite = word as Phaser.Physics.Arcade.Sprite;
            if (wordSprite.y > 650) {
              this.loseLife();
              wordSprite.destroy();
            }
          });
        }

        private spawnWord() {
          if (this.currentWordIndex >= this.gameWords.length) {
            this.endGame(true);
            return;
          }

          const word = this.gameWords[this.currentWordIndex];
          const x = Phaser.Math.Between(50, 750);
          
          const wordSprite = this.physics.add.sprite(x, -50, 'player');
          wordSprite.setDisplaySize(100, 30);
          wordSprite.setTint(0x0066cc);
          wordSprite.setVelocityY(100);
          
          // Add text to word
          const wordText = this.add.text(x, -50, word.word, {
            fontSize: '16px',
            color: '#ffffff'
          }).setOrigin(0.5);

          // Store word data
          (wordSprite as any).wordData = word;
          (wordSprite as any).wordText = wordText;

          this.words.add(wordSprite);
          this.currentWordIndex++;

          // Move text with sprite
          this.tweens.add({
            targets: wordText,
            y: wordText.y + 700,
            duration: 7000,
            onUpdate: () => {
              wordText.setPosition(wordSprite.x, wordSprite.y);
            },
            onComplete: () => {
              wordText.destroy();
            }
          });
        }

        private collectWord(player: Phaser.GameObjects.GameObject, wordSprite: Phaser.GameObjects.GameObject) {
          const sprite = wordSprite as Phaser.Physics.Arcade.Sprite;
          const wordData = (sprite as any).wordData;
          const wordText = (sprite as any).wordText;
          
          // Show Vietnamese meaning briefly
          const meaningText = this.add.text(sprite.x, sprite.y, wordData.meaning_vietnamese, {
            fontSize: '18px',
            color: '#ffff00'
          }).setOrigin(0.5);

          this.tweens.add({
            targets: meaningText,
            alpha: 0,
            y: meaningText.y - 50,
            duration: 1000,
            onComplete: () => {
              meaningText.destroy();
            }
          });

          this.updateScore(10);
          if (wordText) wordText.destroy();
          sprite.destroy();
        }

        private loseLife() {
          this.lives--;
          this.livesText.setText(`Lives: ${this.lives}`);
          
          if (this.lives <= 0) {
            this.endGame(false);
          }
        }
      }

      class MatchingScene extends BaseGameScene {
        private englishWords!: Phaser.GameObjects.Text[];
        private vietnameseWords!: Phaser.GameObjects.Text[];
        private selectedWord: Phaser.GameObjects.Text | null = null;
        private matched: Set<number> = new Set();

        constructor(words: VocabularyWord[], settings: DifficultySettings, callbacks: GameCallbacks) {
          super('MatchingScene', words, settings, callbacks);
        }

        create() {
          this.add.rectangle(400, 300, 800, 600, 0xf0f8ff);
          
          // Title
          this.add.text(400, 50, 'Match English words with Vietnamese meanings', {
            fontSize: '20px',
            color: '#000000'
          }).setOrigin(0.5);

          // Score display
          this.add.text(16, 16, 'Score: 0', {
            fontSize: '24px',
            color: '#000000'
          });

          this.createWordPairs();
        }

        private createWordPairs() {
          this.englishWords = [];
          this.vietnameseWords = [];

          const shuffledVietnamese = [...this.gameWords].sort(() => Math.random() - 0.5);

          this.gameWords.forEach((word, index) => {
            // English words on the left
            const englishText = this.add.text(150, 120 + index * 60, word.word, {
              fontSize: '18px',
              color: '#0066cc',
              backgroundColor: '#ffffff',
              padding: { x: 10, y: 5 }
            }).setOrigin(0.5);

            englishText.setInteractive();
            englishText.on('pointerdown', () => this.selectWord(englishText, index, 'english'));
            this.englishWords.push(englishText);

            // Vietnamese words on the right
            const vietnameseText = this.add.text(650, 120 + index * 60, shuffledVietnamese[index].meaning_vietnamese, {
              fontSize: '18px',
              color: '#cc6600',
              backgroundColor: '#ffffff',
              padding: { x: 10, y: 5 }
            }).setOrigin(0.5);

            vietnameseText.setInteractive();
            const vietnameseIndex = this.gameWords.findIndex(w => w.meaning_vietnamese === shuffledVietnamese[index].meaning_vietnamese);
            vietnameseText.on('pointerdown', () => this.selectWord(vietnameseText, vietnameseIndex, 'vietnamese'));
            this.vietnameseWords.push(vietnameseText);
          });
        }

        private selectWord(textObject: Phaser.GameObjects.Text, wordIndex: number, type: 'english' | 'vietnamese') {
          if (this.matched.has(wordIndex)) return;

          if (!this.selectedWord) {
            this.selectedWord = textObject;
            textObject.setStyle({ backgroundColor: '#ffff00' });
            (textObject as any).wordIndex = wordIndex;
            (textObject as any).wordType = type;
          } else {
            const firstType = (this.selectedWord as any).wordType;
            const firstIndex = (this.selectedWord as any).wordIndex;

            if (firstType !== type && firstIndex === wordIndex) {
              // Correct match
              this.selectedWord.setStyle({ backgroundColor: '#00ff00' });
              textObject.setStyle({ backgroundColor: '#00ff00' });
              this.matched.add(wordIndex);
              this.updateScore(20);

              if (this.matched.size === this.gameWords.length) {
                this.time.delayedCall(1000, () => this.endGame(true));
              }
            } else {
              // Wrong match
              textObject.setStyle({ backgroundColor: '#ff0000' });
              this.time.delayedCall(500, () => {
                textObject.setStyle({ backgroundColor: '#ffffff' });
                this.selectedWord!.setStyle({ backgroundColor: '#ffffff' });
              });
            }

            this.selectedWord = null;
          }
        }
      }

      // Select scene based on game type
      let GameSceneClass: typeof BaseGameScene;
      switch (gameType) {
        case 'wordfall':
          GameSceneClass = WordFallScene;
          break;
        case 'matching':
          GameSceneClass = MatchingScene;
          break;
        default:
          GameSceneClass = WordFallScene;
      }

      const gameScene = new GameSceneClass(gameWords, settings, callbacks);

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: canvasRef.current,
        backgroundColor: '#87CEEB',
        scene: gameScene,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { y: 300 },
            debug: false
          }
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      gameRef.current = new Phaser.Game(config);

    } catch (err) {
      console.error('Failed to initialize game:', err);
      setError('Failed to initialize game');
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [Phaser, gameStarted, gameWords, settings, gameType, callbacks]);

  const startGame = useCallback(() => {
    setGameStarted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <p className="text-gray-600">Loading game engine...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game
          </h3>
          <p className="text-gray-600 mb-4">
            Difficulty: <span className="font-semibold">{difficulty.toUpperCase()}</span>
          </p>
          <div className="text-sm text-gray-500 mb-6">
            <p>Words: {settings.wordCount} | Lives: {settings.lives} | Time: {settings.timeLimit}s</p>
          </div>
          <button
            onClick={startGame}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
          >
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={canvasRef} className="w-full h-96 rounded-lg overflow-hidden" />
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Use keyboard arrows to move and interact with the game</p>
      </div>
    </div>
  );
}

