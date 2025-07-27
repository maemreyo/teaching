import { BaseScene } from './BaseScene';

export class MenuScene extends BaseScene {
  private titleText!: any;
  private menuContainer!: any;
  
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    super.create();
    this.createTitle();
    this.createMenu();
  }

  private createTitle(): void {
    this.titleText = this.add.text(
      this.screenCenterX,
      this.screenCenterY - 200,
      'EduGameHub',
      {
        fontSize: '64px',
        color: '#2E7D32',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        stroke: '#ffffff',
        strokeThickness: 4,
      }
    );
    this.titleText.setOrigin(0.5);

    // Add subtitle
    const subtitle = this.add.text(
      this.screenCenterX,
      this.screenCenterY - 140,
      'English Learning Games for Grade 6',
      {
        fontSize: '24px',
        color: '#1565C0',
        fontFamily: 'Arial, sans-serif',
      }
    );
    subtitle.setOrigin(0.5);

    // Add animation to title
    this.tweens.add({
      targets: this.titleText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createMenu(): void {
    const menuItems = [
      { text: 'Vocabulary Game', key: 'vocabulary', scene: 'VocabularyGameScene' },
      { text: 'Grammar Game', key: 'grammar', scene: 'GrammarGameScene' },
      { text: 'Pronunciation Game', key: 'pronunciation', scene: 'PronunciationGameScene' },
      { text: 'Mixed Challenge', key: 'mixed', scene: 'MixedGameScene' },
      { text: 'Multiplayer', key: 'multiplayer', scene: 'MultiplayerLobbyScene' },
      { text: 'Settings', key: 'settings', scene: 'SettingsScene' }
    ];

    const menuElements: any[] = [];
    
    menuItems.forEach((item, index) => {
      const button = this.createMenuButton(
        this.screenCenterX,
        this.screenCenterY - 50 + (index * 80),
        item.text,
        () => this.handleMenuSelection(item.key, item.scene)
      );
      
      menuElements.push(button);
      
      // Add entrance animation with delay
      button.setAlpha(0);
      this.tweens.add({
        targets: button,
        alpha: 1,
        y: button.y,
        duration: 500,
        delay: index * 100,
        ease: 'Back.easeOut'
      });
    });

    this.menuContainer = this.add.container(0, 0, menuElements);
  }

  private createMenuButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): any {
    const buttonWidth = 300;
    const buttonHeight = 60;

    // Create button background with gradient effect
    const buttonBg = this.add.graphics();
    buttonBg.fillGradientStyle(0x4CAF50, 0x4CAF50, 0x388E3C, 0x388E3C, 1);
    buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
    
    // Add border
    buttonBg.lineStyle(3, 0x2E7D32);
    buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);

    // Create button text
    const buttonText = this.add.text(0, 0, text, {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });
    buttonText.setOrigin(0.5);

    // Create icon (simple circle for now)
    const icon = this.add.graphics();
    icon.fillStyle(0xFFFFFF);
    icon.fillCircle(-buttonWidth/2 + 30, 0, 8);

    const button = this.add.container(x, y, [buttonBg, buttonText, icon]);
    button.setSize(buttonWidth, buttonHeight);
    button.setInteractive({ useHandCursor: true });

    // Add hover effects
    button.on('pointerover', () => {
      this.tweens.add({
        targets: button,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 200,
        ease: 'Power2'
      });
      
      buttonBg.clear();
      buttonBg.fillGradientStyle(0x66BB6A, 0x66BB6A, 0x4CAF50, 0x4CAF50, 1);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
      buttonBg.lineStyle(3, 0x388E3C);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
    });

    button.on('pointerout', () => {
      this.tweens.add({
        targets: button,
        scaleX: 1,
        scaleY: 1,
        duration: 200,
        ease: 'Power2'
      });
      
      buttonBg.clear();
      buttonBg.fillGradientStyle(0x4CAF50, 0x4CAF50, 0x388E3C, 0x388E3C, 1);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
      buttonBg.lineStyle(3, 0x2E7D32);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);
    });

    button.on('pointerdown', () => {
      this.tweens.add({
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

  private handleMenuSelection(gameType: string, sceneName: string): void {
    // Add click sound effect (when audio is implemented)
    console.log(`Selected: ${gameType}, Scene: ${sceneName}`);
    
    // Store game type in registry for the next scene
    this.registry.set('selectedGameType', gameType);
    
    // For now, we'll just show an alert since other scenes aren't implemented yet
    if (sceneName === 'VocabularyGameScene') {
      this.scene.start('GameScene', { gameType: 'vocabulary' });
    } else if (sceneName === 'SettingsScene') {
      // Handle settings
      this.showSettingsModal();
    } else {
      // Show coming soon message
      this.showComingSoonMessage(gameType);
    }
  }

  private showSettingsModal(): void {
    const modalBg = this.add.graphics();
    modalBg.fillStyle(0x000000, 0.8);
    modalBg.fillRect(0, 0, this.gameWidth, this.gameHeight);

    const modalPanel = this.add.graphics();
    modalPanel.fillStyle(0xFFFFFF);
    modalPanel.fillRoundedRect(
      this.screenCenterX - 200,
      this.screenCenterY - 150,
      400,
      300,
      20
    );
    modalPanel.lineStyle(3, 0x2E7D32);
    modalPanel.strokeRoundedRect(
      this.screenCenterX - 200,
      this.screenCenterY - 150,
      400,
      300,
      20
    );

    const settingsTitle = this.add.text(
      this.screenCenterX,
      this.screenCenterY - 100,
      'Settings',
      {
        fontSize: '32px',
        color: '#2E7D32',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold'
      }
    );
    settingsTitle.setOrigin(0.5);

    const closeButton = this.createButton(
      this.screenCenterX,
      this.screenCenterY + 80,
      'Close',
      () => {
        modalBg.destroy();
        modalPanel.destroy();
        settingsTitle.destroy();
        closeButton.destroy();
      },
      { fontSize: '20px' }
    );

    const modal = this.add.container(0, 0, [modalBg, modalPanel, settingsTitle, closeButton]);
    this.showElement(modal);
  }

  private showComingSoonMessage(gameType: string): void {
    const message = this.add.text(
      this.screenCenterX,
      this.screenCenterY + 300,
      `${gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game - Coming Soon!`,
      {
        fontSize: '24px',
        color: '#FF5722',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold',
        backgroundColor: '#FFFFFF',
        padding: { x: 20, y: 10 }
      }
    );
    message.setOrigin(0.5);

    // Auto-hide after 2 seconds
    this.time.delayedCall(2000, () => {
      this.hideElement(message);
    });
  }
}