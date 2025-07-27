'use client';

import { useEffect, useRef, useState } from 'react';

// Import Phaser dynamically to avoid SSR issues
let Phaser: any = null;

interface GameCanvasProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function GameCanvas({ 
  width = 1024, 
  height = 768, 
  className = '' 
}: GameCanvasProps) {
  const gameRef = useRef<any>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phaserLoaded, setPhaserLoaded] = useState(false);

  // Load Phaser dynamically
  useEffect(() => {
    const loadPhaser = async () => {
      try {
        if (typeof window === 'undefined') return;
        
        // Import Phaser and scenes dynamically
        const [PhaserModule, MenuSceneModule, GameSceneModule] = await Promise.all([
          import('phaser'),
          import('@/game/scenes/MenuScene'),
          import('@/game/scenes/GameScene')
        ]);
        
        Phaser = PhaserModule.default || PhaserModule;
        setPhaserLoaded(true);
        
      } catch (err) {
        console.error('Failed to load Phaser:', err);
        setError('Failed to load game engine');
        setIsLoading(false);
      }
    };

    loadPhaser();
  }, []);

  useEffect(() => {
    if (!Phaser || !phaserLoaded || !canvasRef.current || gameRef.current) return;

    const initializeGame = async () => {
      try {
        // Import scenes
        const [MenuSceneModule, GameSceneModule] = await Promise.all([
          import('@/game/scenes/MenuScene'),
          import('@/game/scenes/GameScene')
        ]);

        // Create scene classes that extend Phaser.Scene
        class MenuScene extends Phaser.Scene {
          constructor() {
            super({ key: 'MenuScene' });
          }
          
          create() {
            // Basic menu implementation
            this.add.text(400, 200, 'EduGameHub Menu', { fontSize: '32px', color: '#000' }).setOrigin(0.5);
            const startButton = this.add.text(400, 300, 'Start Game', { fontSize: '24px', color: '#0066cc' }).setOrigin(0.5);
            startButton.setInteractive({ useHandCursor: true });
            startButton.on('pointerdown', () => {
              this.scene.start('GameScene', { gameType: 'vocabulary' });
            });
          }
        }

        class GameScene extends Phaser.Scene {
          constructor() {
            super({ key: 'GameScene' });
          }
          
          create() {
            // Basic game implementation
            this.add.text(400, 200, 'Game Scene', { fontSize: '32px', color: '#000' }).setOrigin(0.5);
            const backButton = this.add.text(400, 300, 'Back to Menu', { fontSize: '24px', color: '#0066cc' }).setOrigin(0.5);
            backButton.setInteractive({ useHandCursor: true });
            backButton.on('pointerdown', () => {
              this.scene.start('MenuScene');
            });
          }
        }

        const config = {
          type: Phaser.AUTO,
          width: width,
          height: height,
          parent: canvasRef.current,
          backgroundColor: '#87CEEB',
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: width,
            height: height,
          },
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 0 },
              debug: process.env.NODE_ENV === 'development'
            }
          },
          scene: [MenuScene, GameScene],
          dom: {
            createContainer: true
          },
          input: {
            mouse: {
              target: canvasRef.current
            },
            touch: {
              target: canvasRef.current
            }
          },
          render: {
            antialias: true,
            pixelArt: false,
            roundPixels: false
          }
        };

        gameRef.current = new Phaser.Game(config);
        
        // Handle game creation events
        gameRef.current.events.once('ready', () => {
          setIsLoading(false);
          console.log('EduGameHub: Game initialized successfully');
        });

        gameRef.current.events.on('hidden', () => {
          console.log('EduGameHub: Game hidden');
        });

        gameRef.current.events.on('visible', () => {
          console.log('EduGameHub: Game visible');
        });

      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize game');
        setIsLoading(false);
      }
    };

    initializeGame();

    // Cleanup function
    return () => {
      if (gameRef.current) {
        console.log('EduGameHub: Cleaning up game instance');
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [Phaser, phaserLoaded, width, height]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width, height]);

  // Handle visibility changes (pause/resume game)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!gameRef.current) return;

      if (document.hidden) {
        gameRef.current.pause();
      } else {
        gameRef.current.resume();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">Game Loading Error</div>
          <div className="text-red-500 text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-blue-600 text-lg font-semibold">Loading EduGameHub...</div>
            <div className="text-blue-500 text-sm mt-2">Initializing game engine</div>
          </div>
        </div>
      )}
      
      <div 
        ref={canvasRef} 
        className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-200"
        style={{ 
          minHeight: `${height}px`,
          minWidth: `${width}px` 
        }}
      />
      
      {/* Game controls overlay */}
      <div className="absolute top-4 right-4 flex gap-2 z-20">
        <button
          onClick={() => {
            if (gameRef.current) {
              if (gameRef.current.isPaused) {
                gameRef.current.resume();
              } else {
                gameRef.current.pause();
              }
            }
          }}
          className="px-3 py-1 bg-white/80 text-gray-700 rounded text-sm hover:bg-white/90 transition-colors shadow-sm"
        >
          ⏸️ Pause
        </button>
        
        <button
          onClick={() => {
            if (gameRef.current && gameRef.current.scene.scenes.length > 0) {
              const activeScene = gameRef.current.scene.getScenes(true)[0];
              if (activeScene) {
                activeScene.scene.restart();
              }
            }
          }}
          className="px-3 py-1 bg-white/80 text-gray-700 rounded text-sm hover:bg-white/90 transition-colors shadow-sm"
        >
          🔄 Restart
        </button>
      </div>

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && Phaser && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs p-2 rounded z-20">
          <div>Phaser v{Phaser.VERSION || 'Unknown'}</div>
          <div>Renderer: {gameRef.current?.renderer?.type === 0 ? 'Canvas' : 'WebGL'}</div>
          <div>FPS: {gameRef.current?.loop?.actualFps?.toFixed(1) || 'N/A'}</div>
        </div>
      )}
    </div>
  );
}