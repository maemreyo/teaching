// BaseScene - types will be resolved at runtime when Phaser is loaded
export class BaseScene {
  protected screenCenterX: number = 0;
  protected screenCenterY: number = 0;
  protected gameWidth: number = 0;
  protected gameHeight: number = 0;
  
  // These will be populated when the scene is instantiated with Phaser
  protected add: any;
  protected scale: any;
  protected tweens: any;
  protected game: any;
  protected time: any;
  protected registry: any;
  protected scene: any;
  protected cameras: any;

  constructor(config: string | any) {
    // Constructor will be called after Phaser is loaded
  }

  init() {
    this.gameWidth = this.scale.width;
    this.gameHeight = this.scale.height;
    this.screenCenterX = this.gameWidth / 2;
    this.screenCenterY = this.gameHeight / 2;
  }

  preload() {
    // Load common assets that all scenes might need
    this.loadCommonAssets();
  }

  create() {
    // Setup common scene elements
    this.setupScene();
  }

  protected loadCommonAssets(): void {
    // Override in child classes to load specific assets
  }

  protected setupScene(): void {
    // Setup common UI elements, background, etc.
    this.createBackground();
    this.setupEventListeners();
  }

  protected createBackground(): void {
    // Create a simple gradient background
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0x98FB98, 0x98FB98, 1);
    graphics.fillRect(0, 0, this.gameWidth, this.gameHeight);
  }

  protected setupEventListeners(): void {
    // Handle window resize
    this.scale.on('resize', this.onResize, this);
  }

  protected onResize(gameSize: any): void {
    this.gameWidth = gameSize.width;
    this.gameHeight = gameSize.height;
    this.screenCenterX = this.gameWidth / 2;
    this.screenCenterY = this.gameHeight / 2;
  }

  protected createButton(
    x: number, 
    y: number, 
    text: string, 
    callback: () => void,
    style?: any
  ): any {
    const defaultStyle: any = {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
    };

    const buttonStyle = { ...defaultStyle, ...style };
    
    // Create button background
    const buttonBg = this.add.graphics();
    const buttonWidth = 200;
    const buttonHeight = 60;
    
    buttonBg.fillStyle(0x4CAF50);
    buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
    buttonBg.lineStyle(3, 0x45A049);
    buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);

    // Create button text
    const buttonText = this.add.text(0, 0, text, buttonStyle);
    buttonText.setOrigin(0.5);

    // Create container
    const button = this.add.container(x, y, [buttonBg, buttonText]);
    button.setSize(buttonWidth, buttonHeight);
    button.setInteractive({ useHandCursor: true });

    // Add hover effects
    button.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x45A049);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
      buttonBg.lineStyle(3, 0x4CAF50);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
      this.game.canvas.style.cursor = 'pointer';
    });

    button.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0x4CAF50);
      buttonBg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
      buttonBg.lineStyle(3, 0x45A049);
      buttonBg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 10);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', callback);

    return button;
  }

  protected showLoading(): any {
    const loadingBg = this.add.graphics();
    loadingBg.fillStyle(0x000000, 0.7);
    loadingBg.fillRect(0, 0, this.gameWidth, this.gameHeight);

    const loadingText = this.add.text(
      this.screenCenterX, 
      this.screenCenterY, 
      'Loading...', 
      {
        fontSize: '32px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif'
      }
    );
    loadingText.setOrigin(0.5);

    return this.add.container(0, 0, [loadingBg, loadingText]);
  }

  protected hideElement(element: any): void {
    this.tweens.add({
      targets: element,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        element.destroy();
      }
    });
  }

  protected showElement(element: any): void {
    element.setAlpha(0);
    this.tweens.add({
      targets: element,
      alpha: 1,
      duration: 300
    });
  }
}