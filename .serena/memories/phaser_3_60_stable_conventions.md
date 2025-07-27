# Phaser 3.60.0 Stable Coding Conventions

## Current Project Setup
- **Phaser Version**: 3.60.0 (downgraded from 3.90.0 for stability)
- **Framework**: Next.js 15.4.4 with React 19.1.0
- **Package Manager**: pnpm (STRICT requirement)

## Phaser 3.60.0 Proven Patterns & Best Practices

### Game Configuration (Stable)
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);
```

### Class-Based Scene Structure (Recommended)
```javascript
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Asset loading
        this.load.image('player', 'assets/player.png');
        this.load.spritesheet('explosion', 'assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    }

    create() {
        // Game object creation
        this.player = this.add.sprite(400, 300, 'player');
        this.setupInput();
        this.createAnimations();
    }

    update() {
        // Game loop logic
    }
}
```

### Asset Loading (3.60.0 Stable)
```javascript
preload() {
    // Basic image loading
    this.load.image('background', 'assets/bg.png');
    
    // Spritesheet with frame data
    this.load.spritesheet('character', 'assets/character.png', {
        frameWidth: 32,
        frameHeight: 48
    });
    
    // Audio files
    this.load.audio('bgMusic', ['assets/music.ogg', 'assets/music.mp3']);
    
    // JSON data
    this.load.json('gameData', 'assets/data.json');
    
    // Atlas (TexturePacker)
    this.load.atlas('sprites', 'assets/sprites.png', 'assets/sprites.json');
}
```

### Game Object Creation (3.60.0)
```javascript
create() {
    // Text objects
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#000',
        fontFamily: 'Arial'
    });
    
    // Sprites with physics
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);
    
    // Interactive objects
    const button = this.add.image(400, 300, 'button')
        .setInteractive()
        .on('pointerdown', this.handleClick, this);
    
    // Groups
    this.enemies = this.add.group();
    this.bullets = this.physics.add.group();
}
```

### Animation System (3.60.0)
```javascript
create() {
    // Create animations
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'player', frame: 4 }],
        frameRate: 20
    });
    
    // Play animations
    this.player.anims.play('walk');
}
```

### Tween System (3.60.0 Stable)
```javascript
// Basic tween
this.tweens.add({
    targets: this.player,
    x: 400,
    y: 300,
    duration: 2000,
    ease: 'Power2',
    onComplete: () => {
        console.log('Tween completed');
    }
});

// Tween with yoyo
this.tweens.add({
    targets: this.scoreText,
    scaleX: 1.2,
    scaleY: 1.2,
    duration: 500,
    yoyo: true,
    repeat: -1
});
```

### Input Handling (3.60.0)
```javascript
create() {
    // Cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
    
    // WASD keys
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');
    
    // Mouse/touch input
    this.input.on('pointerdown', this.handlePointerDown, this);
    this.input.on('pointerup', this.handlePointerUp, this);
}

update() {
    // Handle input
    if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
    } else {
        this.player.setVelocityX(0);
    }
}
```

### Physics (Arcade - 3.60.0)
```javascript
create() {
    // Enable physics for sprite
    this.physics.add.existing(this.player);
    
    // Set physics properties
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setBounce(0.2);
    
    // Collisions
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
}
```

### Timeline System (NEW in 3.60.0)
```javascript
create() {
    // Create timeline for sequence events
    const timeline = this.add.timeline([
        {
            at: 1000,
            run: () => {
                this.enemy = this.add.sprite(100, 100, 'enemy');
            }
        },
        {
            at: 2000,
            tween: {
                targets: this.enemy,
                x: 700,
                duration: 1000
            }
        },
        {
            at: 4000,
            run: () => {
                this.enemy.destroy();
            }
        }
    ]);
    
    timeline.play();
}
```

### Particles (3.60.0)
```javascript
create() {
    // Create particle emitter
    const particles = this.add.particles(0, 0, 'spark', {
        speed: 100,
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD'
    });
    
    // Follow player
    particles.startFollow(this.player);
}
```

### Data Management (3.60.0)
```javascript
create() {
    // Scene data
    this.data.set('score', 0);
    this.data.set('lives', 3);
    
    // Listen for data changes
    this.data.on('changedata-score', (parent, key, value) => {
        this.scoreText.setText('Score: ' + value);
    });
}

updateScore(points) {
    this.data.inc('score', points);
}
```

### Graphics Objects (3.60.0)
```javascript
create() {
    const graphics = this.add.graphics();
    
    // Fill style
    graphics.fillStyle(0xff0000, 1);
    graphics.fillRect(50, 50, 100, 100);
    
    // Line style
    graphics.lineStyle(4, 0x00ff00, 1);
    graphics.strokeRect(200, 50, 100, 100);
    
    // Generate texture from graphics
    graphics.generateTexture('rect', 100, 100);
}
```

### Error Handling (3.60.0)
```javascript
preload() {
    // Handle load errors
    this.load.on('loaderror', (file) => {
        console.error('Failed to load:', file.src);
    });
    
    this.load.on('complete', () => {
        console.log('All assets loaded');
    });
}

create() {
    try {
        // Game initialization
        this.setupGame();
    } catch (error) {
        console.error('Game setup failed:', error);
        this.scene.start('ErrorScene');
    }
}
```

## React + Phaser Integration (3.60.0)

### Component Structure
```javascript
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function PhaserGame() {
    const gameRef = useRef(null);
    
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: gameRef.current,
            scene: GameScene
        };
        
        const game = new Phaser.Game(config);
        
        return () => {
            if (game) {
                game.destroy(true);
            }
        };
    }, []);
    
    return <div ref={gameRef} className="phaser-game" />;
}
```

## Performance Best Practices (3.60.0)
- Use object pools for frequently created/destroyed objects
- Batch similar operations in update loops
- Use texture atlases to reduce draw calls
- Disable debug mode in production
- Use appropriate physics body sizes
- Destroy unused objects and remove event listeners

## Common Gotchas (3.60.0)
- Always destroy game instance in React cleanup
- Use `this` binding correctly in event handlers
- Check for null/undefined before accessing game objects
- Handle scene transitions properly
- Be careful with z-depth and display list ordering

## TypeScript Support (3.60.0)
- Phaser 3.60.0 has excellent TypeScript definitions
- Use proper typing for scene references
- Type custom game object properties
- Use interfaces for game data structures