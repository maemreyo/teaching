import { BaseScene } from './BaseScene';

interface GameData {
  gameType: 'vocabulary' | 'grammar' | 'pronunciation' | 'mixed';
  unitId?: string;
  difficulty?: number;
}

export class GameScene extends BaseScene {
  private gameData!: GameData;
  private score: number = 0;
  private timeLeft: number = 60; // 60 seconds
  private gameTimer!: any;
  private scoreText!: any;
  private timerText!: any;
  private questionText!: any;
  private answerButtons: any[] = [];
  private currentQuestion: any = null;
  private questionIndex: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: GameData) {
    this.gameData = data || { gameType: 'vocabulary' };
    this.score = 0;
    this.timeLeft = 60;
    this.questionIndex = 0;
  }

  create() {
    super.create();
    this.createUI();
    this.startGame();
  }

  private createUI(): void {
    // Create header background
    const headerBg = this.add.graphics();
    headerBg.fillStyle(0x1976D2, 0.9);
    headerBg.fillRect(0, 0, this.gameWidth, 100);

    // Score display
    this.scoreText = this.add.text(50, 30, `Score: ${this.score}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });

    // Timer display
    this.timerText = this.add.text(this.gameWidth - 200, 30, `Time: ${this.timeLeft}s`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      fontStyle: 'bold'
    });

    // Game type indicator
    const gameTypeText = this.add.text(
      this.screenCenterX, 
      30, 
      `${this.gameData.gameType.charAt(0).toUpperCase() + this.gameData.gameType.slice(1)} Game`, 
      {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold'
      }
    );
    gameTypeText.setOrigin(0.5, 0);

    // Question area background
    const questionBg = this.add.graphics();
    questionBg.fillStyle(0xFFFFFF, 0.95);
    questionBg.fillRoundedRect(50, 150, this.gameWidth - 100, 200, 20);
    questionBg.lineStyle(3, 0x1976D2);
    questionBg.strokeRoundedRect(50, 150, this.gameWidth - 100, 200, 20);

    // Question text
    this.questionText = this.add.text(
      this.screenCenterX,
      250,
      'Loading question...',
      {
        fontSize: '24px',
        color: '#333333',
        fontFamily: 'Arial, sans-serif',
        align: 'center',
        wordWrap: { width: this.gameWidth - 150 }
      }
    );
    this.questionText.setOrigin(0.5);

    // Back button
    const backButton = this.createButton(
      100,
      this.gameHeight - 50,
      'Back to Menu',
      () => this.scene.start('MenuScene'),
      { fontSize: '18px' }
    );
  }

  private startGame(): void {
    // Start countdown timer
    this.gameTimer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });

    this.loadNextQuestion();
  }

  private updateTimer(): void {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);

    if (this.timeLeft <= 10) {
      this.timerText.setColor('#FF5722'); // Red color for urgency
    }

    if (this.timeLeft <= 0) {
      this.endGame();
    }
  }

  private loadNextQuestion(): void {
    this.questionIndex++;
    
    // Clear previous answer buttons
    this.answerButtons.forEach(button => button.destroy());
    this.answerButtons = [];

    // Generate question based on game type
    this.currentQuestion = this.generateQuestion();
    
    if (this.currentQuestion) {
      this.displayQuestion();
    } else {
      this.endGame(); // No more questions
    }
  }

  private generateQuestion(): any {
    // Mock question generation - in real implementation, this would fetch from Supabase
    const sampleQuestions = {
      vocabulary: [
        {
          type: 'vocabulary',
          question: 'What does "school" mean?',
          answers: ['A place to learn', 'A type of food', 'A color', 'A sport'],
          correct: 0,
          explanation: 'School is a place where children go to learn.'
        },
        {
          type: 'vocabulary',
          question: 'Choose the correct meaning of "classroom":',
          answers: ['Kitchen', 'Bedroom', 'Room for lessons', 'Bathroom'],
          correct: 2,
          explanation: 'A classroom is a room where students have lessons.'
        },
        {
          type: 'vocabulary',
          question: 'What is a "teacher"?',
          answers: ['A student', 'A person who teaches', 'A book', 'A building'],
          correct: 1,
          explanation: 'A teacher is a person who teaches students.'
        }
      ],
      grammar: [
        {
          type: 'grammar',
          question: 'Choose the correct sentence:',
          answers: ['I goes to school', 'I go to school', 'I going to school', 'I gone to school'],
          correct: 1,
          explanation: 'Use "go" with "I" in present simple tense.'
        }
      ],
      pronunciation: [
        {
          type: 'pronunciation',
          question: 'How do you pronounce "school"?',
          answers: ['/skuːl/', '/ʃuːl/', '/skul/', '/skool/'],
          correct: 0,
          explanation: 'School is pronounced /skuːl/.'
        }
      ],
      mixed: []
    };

    const questions = sampleQuestions[this.gameData.gameType] || sampleQuestions.vocabulary;
    
    if (this.questionIndex <= questions.length) {
      return questions[(this.questionIndex - 1) % questions.length];
    }
    
    return null;
  }

  private displayQuestion(): void {
    if (!this.currentQuestion) return;

    // Update question text
    this.questionText.setText(this.currentQuestion.question);

    // Create answer buttons
    const buttonWidth = (this.gameWidth - 200) / 2 - 20;
    const buttonHeight = 60;
    const startY = 400;

    this.currentQuestion.answers.forEach((answer: string, index: number) => {
      const x = 150 + (index % 2) * (buttonWidth + 40);
      const y = startY + Math.floor(index / 2) * (buttonHeight + 20);

      const button = this.createAnswerButton(x, y, answer, index, buttonWidth, buttonHeight);
      this.answerButtons.push(button);
    });
  }

  private createAnswerButton(
    x: number,
    y: number,
    text: string,
    index: number,
    width: number,
    height: number
  ): any {
    const buttonBg = this.add.graphics();
    buttonBg.fillStyle(0xE3F2FD);
    buttonBg.fillRoundedRect(0, 0, width, height, 10);
    buttonBg.lineStyle(2, 0x1976D2);
    buttonBg.strokeRoundedRect(0, 0, width, height, 10);

    const buttonText = this.add.text(width / 2, height / 2, text, {
      fontSize: '18px',
      color: '#1976D2',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      wordWrap: { width: width - 20 }
    });
    buttonText.setOrigin(0.5);

    const button = this.add.container(x, y, [buttonBg, buttonText]);
    button.setSize(width, height);
    button.setInteractive({ useHandCursor: true });

    button.on('pointerover', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0xBBDEFB);
      buttonBg.fillRoundedRect(0, 0, width, height, 10);
      buttonBg.lineStyle(2, 0x1565C0);
      buttonBg.strokeRoundedRect(0, 0, width, height, 10);
    });

    button.on('pointerout', () => {
      buttonBg.clear();
      buttonBg.fillStyle(0xE3F2FD);
      buttonBg.fillRoundedRect(0, 0, width, height, 10);
      buttonBg.lineStyle(2, 0x1976D2);
      buttonBg.strokeRoundedRect(0, 0, width, height, 10);
    });

    button.on('pointerdown', () => this.handleAnswer(index, button));

    return button;
  }

  private handleAnswer(selectedIndex: number, selectedButton: any): void {
    const isCorrect = selectedIndex === this.currentQuestion.correct;
    
    // Disable all buttons
    this.answerButtons.forEach(button => button.disableInteractive());

    // Show correct/incorrect feedback
    this.showAnswerFeedback(selectedButton, isCorrect);

    if (isCorrect) {
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      
      // Add bonus points for quick answers
      if (this.timeLeft > 50) {
        this.score += 5;
        this.scoreText.setText(`Score: ${this.score}`);
      }
    }

    // Show explanation briefly
    this.showExplanation(this.currentQuestion.explanation);

    // Move to next question after delay
    this.time.delayedCall(2000, () => {
      this.loadNextQuestion();
    });
  }

  private showAnswerFeedback(button: any, isCorrect: boolean): void {
    const [buttonBg] = button.list;
    const color = isCorrect ? 0x4CAF50 : 0xF44336;
    
    buttonBg.clear();
    buttonBg.fillStyle(color, 0.8);
    buttonBg.fillRoundedRect(0, 0, button.width, button.height, 10);
    buttonBg.lineStyle(3, color);
    buttonBg.strokeRoundedRect(0, 0, button.width, button.height, 10);

    // Add scale animation
    this.tweens.add({
      targets: button,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });
  }

  private showExplanation(explanation: string): void {
    const explanationText = this.add.text(
      this.screenCenterX,
      this.gameHeight - 150,
      explanation,
      {
        fontSize: '18px',
        color: '#2E7D32',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#E8F5E8',
        padding: { x: 15, y: 10 },
        align: 'center',
        wordWrap: { width: this.gameWidth - 100 }
      }
    );
    explanationText.setOrigin(0.5);

    // Auto-hide explanation
    this.time.delayedCall(1800, () => {
      explanationText.destroy();
    });
  }

  private endGame(): void {
    if (this.gameTimer) {
      this.gameTimer.destroy();
    }

    // Clear answer buttons
    this.answerButtons.forEach(button => button.destroy());

    // Show game over screen
    this.showGameOverScreen();
  }

  private showGameOverScreen(): void {
    const gameOverBg = this.add.graphics();
    gameOverBg.fillStyle(0x000000, 0.8);
    gameOverBg.fillRect(0, 0, this.gameWidth, this.gameHeight);

    const gameOverPanel = this.add.graphics();
    gameOverPanel.fillStyle(0xFFFFFF);
    gameOverPanel.fillRoundedRect(
      this.screenCenterX - 250,
      this.screenCenterY - 200,
      500,
      400,
      20
    );
    gameOverPanel.lineStyle(3, 0x1976D2);
    gameOverPanel.strokeRoundedRect(
      this.screenCenterX - 250,
      this.screenCenterY - 200,
      500,
      400,
      20
    );

    const gameOverTitle = this.add.text(
      this.screenCenterX,
      this.screenCenterY - 120,
      'Game Over!',
      {
        fontSize: '36px',
        color: '#1976D2',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold'
      }
    );
    gameOverTitle.setOrigin(0.5);

    const finalScore = this.add.text(
      this.screenCenterX,
      this.screenCenterY - 50,
      `Final Score: ${this.score}`,
      {
        fontSize: '28px',
        color: '#2E7D32',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'bold'
      }
    );
    finalScore.setOrigin(0.5);

    const playAgainButton = this.createButton(
      this.screenCenterX - 100,
      this.screenCenterY + 50,
      'Play Again',
      () => this.scene.restart(),
      { fontSize: '20px' }
    );

    const menuButton = this.createButton(
      this.screenCenterX + 100,
      this.screenCenterY + 50,
      'Main Menu',
      () => this.scene.start('MenuScene'),
      { fontSize: '20px' }
    );
  }
}