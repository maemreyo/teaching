// GameUtils - types will be resolved at runtime when Phaser is loaded
export class GameUtils {
  /**
   * Create a responsive button with hover effects
   */
  static createButton(
    scene: any,
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    callback: () => void,
    style?: ButtonStyle
  ): any {
    const defaultStyle: ButtonStyle = {
      backgroundColor: 0x4CAF50,
      hoverColor: 0x45A049,
      textColor: '#ffffff',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: 0x388E3C
    };

    const buttonStyle = { ...defaultStyle, ...style };

    // Create button background
    const buttonBg = scene.add.graphics();
    this.drawButton(buttonBg, width, height, buttonStyle, false);

    // Create button text
    const buttonText = scene.add.text(0, 0, text, {
      fontSize: buttonStyle.fontSize,
      color: buttonStyle.textColor,
      fontFamily: buttonStyle.fontFamily,
      align: 'center'
    });
    buttonText.setOrigin(0.5);

    // Create container
    const button = scene.add.container(x, y, [buttonBg, buttonText]);
    button.setSize(width, height);
    button.setInteractive({ useHandCursor: true });

    // Add hover effects
    button.on('pointerover', () => {
      this.drawButton(buttonBg, width, height, buttonStyle, true);
      scene.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 150,
        ease: 'Power2'
      });
    });

    button.on('pointerout', () => {
      this.drawButton(buttonBg, width, height, buttonStyle, false);
      scene.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 150,
        ease: 'Power2'
      });
    });

    button.on('pointerdown', () => {
      scene.tweens.add({
        targets: button,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 100,
        yoyo: true,
        onComplete: callback
      });
    });

    return button;
  }

  private static drawButton(
    graphics: any,
    width: number,
    height: number,
    style: ButtonStyle,
    isHovered: boolean
  ): void {
    graphics.clear();
    
    const bgColor = isHovered ? style.hoverColor : style.backgroundColor;
    graphics.fillStyle(bgColor);
    graphics.fillRoundedRect(-width/2, -height/2, width, height, style.borderRadius);
    
    if (style.borderWidth && style.borderColor) {
      graphics.lineStyle(style.borderWidth, style.borderColor);
      graphics.strokeRoundedRect(-width/2, -height/2, width, height, style.borderRadius);
    }
  }

  /**
   * Create animated text with typewriter effect
   */
  static createTypewriterText(
    scene: any,
    x: number,
    y: number,
    text: string,
    style: any,
    speed: number = 50
  ): any {
    const textObject = scene.add.text(x, y, '', style);
    
    let i = 0;
    const timer = scene.time.addEvent({
      delay: speed,
      callback: () => {
        textObject.text += text[i];
        i++;
        if (i >= text.length) {
          timer.destroy();
        }
      },
      repeat: text.length - 1
    });

    return textObject;
  }

  /**
   * Create a modal dialog
   */
  static createModal(
    scene: any,
    width: number,
    height: number,
    title: string,
    content: string
  ): any {
    // Background overlay
    const overlay = scene.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(-scene.scale.width/2, -scene.scale.height/2, scene.scale.width, scene.scale.height);

    // Modal background
    const modalBg = scene.add.graphics();
    modalBg.fillStyle(0xFFFFFF);
    modalBg.fillRoundedRect(-width/2, -height/2, width, height, 20);
    modalBg.lineStyle(3, 0x1976D2);
    modalBg.strokeRoundedRect(-width/2, -height/2, width, height, 20);

    // Title
    const titleText = scene.add.text(0, -height/2 + 40, title, {
      fontSize: '24px',
      color: '#1976D2',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });
    titleText.setOrigin(0.5);

    // Content
    const contentText = scene.add.text(0, -20, content, {
      fontSize: '16px',
      color: '#333333',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      wordWrap: { width: width - 60 }
    });
    contentText.setOrigin(0.5);

    const modal = scene.add.container(scene.scale.width/2, scene.scale.height/2, [
      overlay, modalBg, titleText, contentText
    ]);

    return modal;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   */
  static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Format time in MM:SS format
   */
  static formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Calculate distance between two points
   */
  static distance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /**
   * Linear interpolation
   */
  static lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  /**
   * Clamp a value between min and max
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Generate a random integer between min and max (inclusive)
   */
  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate a random float between min and max
   */
  static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Check if two rectangles overlap
   */
  static rectanglesOverlap(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * Create a particle effect
   */
  static createParticles(
    scene: any,
    x: number,
    y: number,
    color: number,
    count: number = 10
  ): void {
    for (let i = 0; i < count; i++) {
      const particle = scene.add.graphics();
      particle.fillStyle(color);
      particle.fillCircle(0, 0, 3);
      particle.setPosition(x, y);

      const angle = (Math.PI * 2 * i) / count;
      const velocity = this.randomFloat(50, 150);

      scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * velocity,
        y: y + Math.sin(angle) * velocity,
        alpha: 0,
        duration: 1000,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  /**
   * Screen shake effect
   */
  static screenShake(scene: Phaser.Scene, duration: number = 100, intensity: number = 5): void {
    if (scene.cameras && scene.cameras.main) {
      scene.cameras.main.shake(duration, intensity * 0.01);
    }
  }

  /**
   * Flash effect
   */
  static flashScreen(scene: Phaser.Scene, color: number = 0xFFFFFF, duration: number = 100): void {
    if (scene.cameras && scene.cameras.main) {
      scene.cameras.main.flash(duration, color >> 16, (color >> 8) & 0xFF, color & 0xFF);
    }
  }
}

interface ButtonStyle {
  backgroundColor?: number;
  hoverColor?: number;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: number;
}