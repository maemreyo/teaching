# Phaser 3.90.0 Modern Coding Conventions

## Current Project Setup
- **Phaser Version**: 3.90.0 (from package.json)
- **Framework**: Next.js 15.4.4 with React 19.1.0
- **Package Manager**: pnpm (STRICT requirement)

## Modern Phaser 3.90.0 Syntax & Best Practices

### Game Configuration
```javascript
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [PreloadScene, GameScene]
};

const game = new Phaser.Game(config);
```

### Asset Loading (Modern API)
```javascript
// Font loading (new in 3.87+)
preload() {
    this.load.font('CustomFont', 'assets/fonts/custom.otf', 'opentype');
    
    // Video loading (simplified API)
    this.load.video('intro', 'assets/video/intro.mp4', true); // noAudio flag
    
    // Image with normal map
    this.load.image({ 
        key: 'player', 
        url: 'assets/player.png', 
        normalMap: 'assets/player_n.png' 
    });
    
    // SVG with sizing
    this.load.svg('logo', 'assets/logo.svg', { width: 300, height: 200 });
}
```

### Modern Game Object Creation
```javascript
create() {
    // Text with custom font
    this.add.text(32, 32, 'Hello World', {
        fontFamily: 'CustomFont',
        fontSize: 48,
        color: '#ffffff'
    });
    
    // Video game object
    const video = this.add.video(400, 300, 'intro');
    video.play();
    
    // Interactive objects with pixel-perfect detection
    const sprite = this.add.sprite(x, y, 'key')
        .setInteractive({ pixelPerfect: true })
        .on('pointerdown', this.handleClick, this);
}
```

### Animation Chaining (Modern API)
```javascript
// Chain multiple animations
this.player.anims.play('walk')
    .anims.chain('jump')
    .anims.chain('land');

// Advanced particle animations
const emitter = particles.createEmitter({
    x: 400,
    y: 300,
    speed: 200,
    anims: {
        key: 'sparkle',
        frameRate: 10,
        repeat: -1,
        randomFrame: true,
        yoyo: true
    }
});
```

### Modern Tween System
```javascript
// Tween with from/to values
this.tweens.add({
    targets: sprite,
    alpha: { from: 0, to: 1 },
    duration: 1000,
    ease: 'Power2'
});

// Event-driven tweens
const tween = this.tweens.add({
    targets: sprite,
    x: 400,
    duration: 2000
});

tween.on('complete', () => {
    console.log('Tween completed');
});
```

### Input Handling (Updated)
```javascript
// Keyboard with proper key handling
this.cursors = this.input.keyboard.addKeys('W,A,S,D');

// Pointer events
this.input.on('pointerupoutside', this.handlePointerUp, this);
this.input.on('gameover', this.handleMouseOver, this);

// Check if mouse is over canvas
if (this.input.isOver) {
    // Mouse is over game canvas
}
```

### Data Management (Modern API)
```javascript
// Set multiple data values
this.data.set({
    score: 100,
    level: 1,
    lives: 3
});

// Direct access to values
if (this.data.values.score > 500) {
    this.data.values.lives += 1;
}
```

### Physics (Optimized)
```javascript
// Single step physics for precise control
this.physics.world.singleStep();

// Optimized body updates
body.preUpdate(willStep, delta);
```

### Modern Masking
```javascript
// Bitmap mask via factory
const mask = this.add.bitmapMask(x, y, 'maskTexture');

// Shape as geometry mask
const shape = this.add.rectangle(100, 100, 50, 50);
gameObject.setMask(shape.createGeometryMask());
```

### WebGL Optimization
```javascript
// Modern pipeline configuration
config.render = {
    autoMobilePipeline: true, // Auto-detect mobile
    defaultPipeline: 'MultiTintPipeline'
};
```

### DOM Integration
```javascript
// Enable DOM container
config.dom = {
    createContainer: true
};

// Create DOM elements
this.add.dom(x, y, 'div', 
    'background-color: lime; width: 220px; height: 100px', 
    'Content'
);
```

## React + Phaser Integration Patterns

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
            game.destroy(true);
        };
    }, []);
    
    return <div ref={gameRef} className="phaser-game" />;
}
```

## Performance Best Practices
- Use `highp float` precision for shaders on mobile
- Enable auto mobile pipeline detection
- Implement object pooling for frequently created/destroyed objects
- Use texture atlases for sprite animations
- Minimize draw calls with sprite batching

## Error Handling
- Always check for WebGL context loss
- Implement graceful fallbacks for unsupported features
- Use try-catch blocks around asset loading
- Monitor memory usage with particle systems