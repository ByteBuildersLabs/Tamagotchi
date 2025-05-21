// gameEngine.ts
import {
  Player,
  Platform,
  GameEngineState,
  BackgroundLayer,
} from '../../types/SkyJumpTypes'; // Asegúrate que la ruta es correcta
import {
  PLAYER_VISUAL_WIDTH, PLAYER_VISUAL_HEIGHT,
  PLAYER_HITBOX_WIDTH, PLAYER_HITBOX_HEIGHT,
  PLAYER_HITBOX_OFFSET_X, PLAYER_HITBOX_OFFSET_Y,
  PLATFORM_WIDTH, PLATFORM_HEIGHT, INITIAL_PLATFORM_COUNT,
  PLATFORM_MIN_Y_SEPARATION, PLATFORM_MAX_Y_SEPARATION, PLATFORM_HORIZONTAL_MAX_FACTOR,
  INITIAL_VELOCITY_Y_BASE, GRAVITY_BASE, PLAYER_MAX_FALL_SPEED,
  CAMERA_FOLLOW_THRESHOLD_FACTOR, HITBOX_MARGIN,
  GYRO_SENSITIVITY, SCORE_PER_PIXEL_HEIGHT,
  BACKGROUND_LAYERS_PATHS, // Debería ser BACKGROUND_LAYERS_SOURCES si usas imports
  VISIBLE_PLATFORM_MARGIN_FACTOR, // Para eliminar plataformas
  PLATFORM_GENERATION_BUFFER_FACTOR, // NUEVA CONSTANTE para el buffer de generación
  LOGICAL_GAME_WIDTH,
  LOGICAL_GAME_HEIGHT,
} from './gameConfig'; // Asegúrate que la ruta es correcta
import { loadImage } from './assetLoader'; // Asegúrate que la ruta es correcta

// En gameConfig.ts, añade:
// export const PLATFORM_GENERATION_BUFFER_FACTOR = 2.5; // Generar plataformas hasta 2.5 pantallas por encima

export class GameEngine {
  private ctx: CanvasRenderingContext2D;
  private state: GameEngineState;
  private beastImageRight: HTMLImageElement | null = null;
  private beastImageLeft: HTMLImageElement | null = null;
  private platformImage: HTMLImageElement | null = null;
  private backgroundLayers: BackgroundLayer[] = [];

  private onScoreUpdateCallback?: (score: number) => void;
  private onGameOverCallback?: (finalScore: number) => void;

  private actualCanvasWidth: number;
  private actualCanvasHeight: number;
  private scaleFactor: number = 1;

  constructor(
    canvas: HTMLCanvasElement,
    beastImgRightSrc: string,
    beastImgLeftSrc: string,
    platformImgSrc: string,
    onScoreUpdate?: (score: number) => void,
    onGameOver?: (finalScore: number) => void
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.actualCanvasWidth = canvas.width;
    this.actualCanvasHeight = canvas.height;
    this.onScoreUpdateCallback = onScoreUpdate;
    this.onGameOverCallback = onGameOver;

    this.state = this.getInitialGameState();
    this.adjustGameSizeAndPhysics(this.actualCanvasWidth, this.actualCanvasHeight);

    this.loadAssets(beastImgRightSrc, beastImgLeftSrc, platformImgSrc)
      .then(() => {
        this.resetGame();
      })
      .catch(error => {
        console.error("Failed to load game assets in GameEngine constructor:", error);
      });
  }

  private async loadAssets(playerRightPath: string, playerLeftPath: string, platPath: string): Promise<void> {
    try {
      [this.beastImageRight, this.beastImageLeft, this.platformImage] = await Promise.all([
        loadImage(playerRightPath), // Deberían ser playerRightSrc, playerLeftSrc, platSrc
        loadImage(playerLeftPath),
        loadImage(platPath),
      ]);

      // Asumiendo que BACKGROUND_LAYERS_PATHS es BACKGROUND_LAYERS_SOURCES de gameConfig.ts
      const bgPromises = BACKGROUND_LAYERS_PATHS.map(bgInfo => // CAMBIAR A BACKGROUND_LAYERS_SOURCES
        loadImage(bgInfo.path).then(img => ({
          img: img,
          scoreThreshold: bgInfo.scoreThreshold,
          path: bgInfo.path,
        }))
      );
      this.backgroundLayers = await Promise.all(bgPromises);
      
      if(this.state.player) {
          this.state.player.imgRight = this.beastImageRight;
          this.state.player.imgLeft = this.beastImageLeft;
      }

    } catch (error) {
      console.error("Error loading critical assets:", error);
      throw error;
    }
  }

  private getInitialGameState(): GameEngineState {
    return {
      boardWidth: this.actualCanvasWidth,
      boardHeight: this.actualCanvasHeight,
      cameraY: 0,
      player: {
        x: this.actualCanvasWidth / 2 - (PLAYER_HITBOX_WIDTH * this.scaleFactor) / 2,
        y: this.actualCanvasHeight * 0.8, 
        worldY: this.actualCanvasHeight * 0.8,
        width: PLAYER_HITBOX_WIDTH, 
        height: PLAYER_HITBOX_HEIGHT, 
        visualWidth: PLAYER_VISUAL_WIDTH,
        visualHeight: PLAYER_VISUAL_HEIGHT,
        hitboxOffsetX: PLAYER_HITBOX_OFFSET_X,
        hitboxOffsetY: PLAYER_HITBOX_OFFSET_Y,
        imgRight: null, 
        imgLeft: null,  
        velocityX: 0,
        velocityY: 0,
        facingRight: true,
        onPlatform: false,
      },
      platforms: [],
      score: 0,
      maxHeightReached: 0, 
      gameOver: false,
      running: false,
      currentBackgroundIndex: 0,
      initialVelocityY: INITIAL_VELOCITY_Y_BASE,
      gravity: GRAVITY_BASE,
      touchControls: { isPressed: false, direction: 0 },
      gyroControls: { enabled: false, calibration: 0, sensitivity: GYRO_SENSITIVITY },
      platformWidth: PLATFORM_WIDTH, 
      platformHeight: PLATFORM_HEIGHT, 
      lastTimestamp: 0,
    };
  }

  public adjustGameSizeAndPhysics(newCanvasWidth: number, newCanvasHeight: number): void {
    this.actualCanvasWidth  = newCanvasWidth;
    this.actualCanvasHeight = newCanvasHeight;
    if (this.ctx.canvas) {
      this.ctx.canvas.width   = newCanvasWidth;
      this.ctx.canvas.height  = newCanvasHeight;
    }
  
    this.scaleFactor = this.actualCanvasWidth / LOGICAL_GAME_WIDTH;
  
    this.state.boardWidth  = this.actualCanvasWidth;
    this.state.boardHeight = this.actualCanvasHeight;
  
    const screenSizeFactor = Math.max(
      1,
      this.actualCanvasHeight / (LOGICAL_GAME_HEIGHT * this.scaleFactor)
    );
    this.state.initialVelocityY =
      INITIAL_VELOCITY_Y_BASE * Math.sqrt(screenSizeFactor) * this.scaleFactor;
    this.state.gravity =
      GRAVITY_BASE * Math.sqrt(screenSizeFactor) * this.scaleFactor;
  
    this.state.player.width         = PLAYER_HITBOX_WIDTH   * this.scaleFactor;
    this.state.player.height        = PLAYER_HITBOX_HEIGHT  * this.scaleFactor;
    this.state.player.visualWidth   = PLAYER_VISUAL_WIDTH   * this.scaleFactor;
    this.state.player.visualHeight  = PLAYER_VISUAL_HEIGHT  * this.scaleFactor;
    this.state.player.hitboxOffsetX = PLAYER_HITBOX_OFFSET_X * this.scaleFactor; // Estos offsets son desde el visual a la hitbox
    this.state.player.hitboxOffsetY = PLAYER_HITBOX_OFFSET_Y * this.scaleFactor; // Deberían usarse para calcular la pos visual desde la hitbox
  
    this.state.platformWidth  = PLATFORM_WIDTH  * this.scaleFactor;
    this.state.platformHeight = PLATFORM_HEIGHT * this.scaleFactor;
  }
  
  private placeInitialPlatforms(): void {
    this.state.platforms = [];
    const { boardWidth, boardHeight, platformWidth, platformHeight } = this.state;

    this.state.platforms.push({
      x: boardWidth / 2 - platformWidth / 2,
      y: boardHeight - platformHeight * 3, 
      worldY: boardHeight - platformHeight * 3, 
      width: platformWidth,
      height: platformHeight,
      img: this.platformImage,
    });

    let lastY = this.state.platforms[0].worldY;
    for (let i = 0; i < INITIAL_PLATFORM_COUNT; i++) {
      const randomX = Math.random() * (boardWidth * PLATFORM_HORIZONTAL_MAX_FACTOR - platformWidth);
      const ySeparation = (PLATFORM_MIN_Y_SEPARATION + Math.random() * (PLATFORM_MAX_Y_SEPARATION - PLATFORM_MIN_Y_SEPARATION)) * this.scaleFactor;
      lastY -= ySeparation;
      this.state.platforms.push({
        x: randomX,
        y: lastY, 
        worldY: lastY,
        width: platformWidth,
        height: platformHeight,
        img: this.platformImage,
      });
    }
  }

  private generateNewPlatform(): void {
    const { platforms, boardWidth, platformWidth, platformHeight, cameraY } = this.state;
    
    let lastPlatformY;
    if (platforms.length > 0) {
        lastPlatformY = platforms[platforms.length - 1].worldY;
    } else {
        // Si no hay plataformas, generar la primera relativa a la cámara
        // Esto asegura que el juego pueda empezar incluso si se eliminan todas las plataformas iniciales por alguna razón.
        lastPlatformY = cameraY + this.state.boardHeight * 0.5; // Empezar a generar desde la mitad de la pantalla hacia arriba
    }
    
    const randomX = Math.random() * (boardWidth * PLATFORM_HORIZONTAL_MAX_FACTOR - platformWidth);
    const ySeparation = (PLATFORM_MIN_Y_SEPARATION + Math.random() * (PLATFORM_MAX_Y_SEPARATION - PLATFORM_MIN_Y_SEPARATION)) * this.scaleFactor;
    const newWorldY = lastPlatformY - ySeparation; // Generar más arriba (Y menor)

    platforms.push({
      x: randomX,
      y: newWorldY - cameraY, // y relativo a la cámara para el primer renderizado (aunque se recalcula en draw)
      worldY: newWorldY,
      width: platformWidth,
      height: platformHeight,
      img: this.platformImage,
    });
  }

  private updatePlatforms(): void {
    const { platforms, cameraY, boardHeight } = this.state;

    // Lógica de generación de buffer:
    // Queremos mantener plataformas generadas hasta una cierta altura por encima de la vista de la cámara.
    // El "techo" de nuestro buffer de generación. Las plataformas se generan por debajo de este techo.
    const generationCeiling = cameraY - (boardHeight * (PLATFORM_GENERATION_BUFFER_FACTOR -1)); // PLATFORM_GENERATION_BUFFER_FACTOR > 1

    // Mientras la plataforma más alta generada (si existe) esté por debajo de este techo de generación,
    // o si no hay plataformas, generamos una nueva.
    // worldY disminuye al subir.
    while (platforms.length === 0 || platforms[platforms.length - 1].worldY > generationCeiling) {
        if (platforms.length > 500) { // Salvaguarda para evitar bucles infinitos si algo va mal
          console.warn("Too many platforms, breaking generation loop.");
          break;
        }
        this.generateNewPlatform();
    }
    
    // Eliminar plataformas que están muy por debajo de la vista
    // (VISIBLE_PLATFORM_MARGIN_FACTOR pantallas por debajo del borde inferior de la cámara)
    const removalThreshold = cameraY + boardHeight * VISIBLE_PLATFORM_MARGIN_FACTOR;
    this.state.platforms = platforms.filter(p => p.worldY < removalThreshold);
  }

  private detectCollision(player: Player, platform: Platform): boolean {
    if (player.velocityY < 0) return false; 
  
    // Dimensiones de la hitbox del jugador (ya escaladas en el estado)
    const playerHitboxLeft = player.x;
    const playerHitboxBottom = player.worldY + player.height;
    const playerHitboxRight = player.x + player.width;
  
    // Dimensiones de la plataforma (ya escaladas en el estado)
    const platformTop = platform.worldY;
    const platformLeft = platform.x;
    // const platformBottom = platform.worldY + platform.height; // No se usa directamente para esta colisión
    const platformRight = platform.x + platform.width;
  
    const scaledHitboxMargin = HITBOX_MARGIN * this.scaleFactor;
  
    return (
      playerHitboxBottom >= platformTop - scaledHitboxMargin && // Permitir un pequeño margen superior para aterrizar
      playerHitboxBottom <= platformTop + platform.height / 2 + scaledHitboxMargin && 
      playerHitboxRight > platformLeft &&
      playerHitboxLeft < platformRight
    );
  }
  
  private updatePlayer(deltaTime: number): void {
    const { player, gravity, boardWidth, initialVelocityY, cameraY, boardHeight } = this.state;
    const frameFactor = deltaTime * 60; 
  
    player.x += player.velocityX * frameFactor; 
  
    const visualPlayerWidthScaled = player.visualWidth; // visualWidth ya está escalado en adjustGameSizeAndPhysics
    if (player.x + visualPlayerWidthScaled < 0) player.x = boardWidth;
    else if (player.x > boardWidth) player.x = -visualPlayerWidthScaled;
  
    player.velocityY += gravity * frameFactor; 
    player.velocityY = Math.min(player.velocityY, PLAYER_MAX_FALL_SPEED * this.scaleFactor); 
    player.worldY += player.velocityY * frameFactor;
  
    let onAnyPlatform = false;
    for (const platform of this.state.platforms) {
      if (this.detectCollision(player, platform)) {
        player.velocityY = initialVelocityY; 
        player.worldY = platform.worldY - player.height; // player.height es la altura de la hitbox (escalada)
        onAnyPlatform = true;
        break;
      }
    }
    player.onPlatform = onAnyPlatform;
  
    const visualPlayerHeightScaled = player.visualHeight; // visualHeight ya está escalado
    if (player.worldY > cameraY + boardHeight + visualPlayerHeightScaled) { 
      this.state.gameOver = true;
      this.state.running = false;
      if (this.onGameOverCallback) {
        this.onGameOverCallback(this.state.score);
      }
    }
  }
  
  private updateCamera(): void {
    const { player, boardHeight } = this.state;
    const cameraThresholdOnScreen = boardHeight * CAMERA_FOLLOW_THRESHOLD_FACTOR; 
    const cameraCatchUpSpeed = 0.12;    
  
    const playerTopOnScreen = player.worldY - this.state.cameraY;
  
    if (playerTopOnScreen < cameraThresholdOnScreen) {
      const deviation = cameraThresholdOnScreen - playerTopOnScreen;
      this.state.cameraY -= deviation * cameraCatchUpSpeed;
    }
  }
  
  private updateScore(): void {
    const currentHeight = Math.max(0, -this.state.cameraY); 
    
    if (currentHeight > this.state.maxHeightReached) {
      this.state.maxHeightReached = currentHeight;
    }
    
    const newScore = Math.floor(this.state.maxHeightReached * SCORE_PER_PIXEL_HEIGHT); 

    if (newScore > this.state.score) {
      this.state.score = newScore;
      if (this.onScoreUpdateCallback) {
        this.onScoreUpdateCallback(this.state.score);
      }
      this.updateBackgroundByScore();
    }
  }
  
  private updateBackgroundByScore(): void {
    let newBgIndex = 0;
    if (this.backgroundLayers && this.backgroundLayers.length > 0) {
      for (let i = this.backgroundLayers.length - 1; i >= 0; i--) {
        if (this.state.score >= this.backgroundLayers[i].scoreThreshold) {
          newBgIndex = i;
          break;
        }
      }
    }
    if (this.state.currentBackgroundIndex !== newBgIndex) {
      this.state.currentBackgroundIndex = newBgIndex;
    }
  }

  private gameLoop = (timestamp: number): void => {
    if (!this.state.running && !this.state.gameOver) { 
        if(this.state.animationFrameId) cancelAnimationFrame(this.state.animationFrameId);
        this.state.animationFrameId = undefined;
        return;
    }
    // Si es game over y ya se detuvo el running, dibuja una última vez y para.
    if (this.state.gameOver && !this.state.running) { 
        this.draw(); 
        if(this.state.animationFrameId) cancelAnimationFrame(this.state.animationFrameId);
        this.state.animationFrameId = undefined;
        return;
    }

    const deltaTime = (timestamp - (this.state.lastTimestamp || timestamp)) / 1000; 
    this.state.lastTimestamp = timestamp;

    this.updatePlayer(Math.min(deltaTime, 0.1)); 
    this.updateCamera(); // La cámara se actualiza suavemente
    this.updateScore();
    this.updatePlatforms(); // Las plataformas se generan/eliminan basándose en la nueva posición de la cámara

    this.draw();

    if (!this.state.gameOver) {
      this.state.animationFrameId = requestAnimationFrame(this.gameLoop);
    } else {
       this.state.running = false; 
       // El callback de game over ya fue llamado en updatePlayer
       // Dibuja el estado final y cancela el loop.
       this.draw(); 
       if(this.state.animationFrameId) cancelAnimationFrame(this.state.animationFrameId);
       this.state.animationFrameId = undefined;
    }
  };

  private draw(): void {
    this.ctx.clearRect(0, 0, this.actualCanvasWidth, this.actualCanvasHeight);

    const bgLayerToDraw = this.backgroundLayers[this.state.currentBackgroundIndex];
    if (bgLayerToDraw && bgLayerToDraw.img) {
      const bgImg = bgLayerToDraw.img;
      const canvasAspect = this.actualCanvasWidth / this.actualCanvasHeight;
      const bgAspect = bgImg.width / bgImg.height;
      let drawWidth, drawHeight, offsetX, offsetY;

      if (canvasAspect > bgAspect) { 
        drawWidth = this.actualCanvasWidth;
        drawHeight = this.actualCanvasWidth / bgAspect;
        offsetX = 0;
        offsetY = (this.actualCanvasHeight - drawHeight) / 2; 
      } else { 
        drawHeight = this.actualCanvasHeight;
        drawWidth = this.actualCanvasHeight * bgAspect;
        offsetY = 0;
        offsetX = (this.actualCanvasWidth - drawWidth) / 2; 
      }
      this.ctx.drawImage(bgImg, offsetX, offsetY, drawWidth, drawHeight);
    }

    this.ctx.save();
    this.ctx.translate(0, -this.state.cameraY); 

    this.state.platforms.forEach(platform => {
      if (platform.img) {
        this.ctx.drawImage(platform.img, platform.x, platform.worldY, platform.width, platform.height);
      }
    });

    const { player } = this.state;
    const playerImageToDraw = player.facingRight ? this.beastImageRight : this.beastImageLeft;
    if (playerImageToDraw) {
      // player.x y player.worldY son el top-left de la hitbox.
      // Los hitboxOffsets son desde el visual al hitbox.
      // Para dibujar el visual, restamos los offsets escalados de la posición de la hitbox.
      const visualX = player.x - player.hitboxOffsetX; // hitboxOffsetX ya está escalado
      const visualY = player.worldY - player.hitboxOffsetY; // hitboxOffsetY ya está escalado
      
      this.ctx.drawImage(
        playerImageToDraw,
        visualX,
        visualY,
        player.visualWidth,  // visualWidth ya está escalado
        player.visualHeight  // visualHeight ya está escalado
      );
    }
    
    this.ctx.restore(); 
  }

  public resetGame(): void {
    if(this.state.animationFrameId) {
        cancelAnimationFrame(this.state.animationFrameId);
        this.state.animationFrameId = undefined;
    }

    this.state = this.getInitialGameState(); 
    // Es crucial que las imágenes ya estén cargadas y asignadas aquí
    if (this.beastImageRight && this.beastImageLeft) {
      this.state.player.imgRight = this.beastImageRight;
      this.state.player.imgLeft = this.beastImageLeft;
    } else {
      console.warn("Player images not loaded at resetGame call");
    }

    this.adjustGameSizeAndPhysics(this.actualCanvasWidth, this.actualCanvasHeight); 

    this.state.player.x = this.state.boardWidth / 2 - this.state.player.width / 2; 
    this.state.player.worldY = this.state.boardHeight * 0.75 - this.state.player.height; // Empezar un poco más arriba
    this.state.player.velocityY = this.state.initialVelocityY;

    this.placeInitialPlatforms();
    
    // Asegurar que las primeras plataformas estén en una posición razonable para el jugador
    if (this.state.platforms.length > 0) {
        const firstPlatform = this.state.platforms[0];
        this.state.player.worldY = firstPlatform.worldY - this.state.player.height - 10 * this.scaleFactor; // Aterrizar sobre la primera plataforma
        this.state.player.x = firstPlatform.x + firstPlatform.width / 2 - this.state.player.width / 2; // Centrar en la primera plataforma
        this.state.cameraY = this.state.player.worldY - this.state.boardHeight * 0.75; // Ajustar cámara para ver al jugador
    }


    this.state.score = 0; 
    this.state.maxHeightReached = 0;
    // this.state.cameraY = 0; // La cámara se ajustará basada en la posición del jugador
    this.state.currentBackgroundIndex = 0; 

    this.state.gameOver = false;
    this.state.running = true;
    this.state.lastTimestamp = performance.now(); 
    
    if (!this.state.animationFrameId) { 
        this.state.animationFrameId = requestAnimationFrame(this.gameLoop);
    }
  }

  public stopGame(): void {
    this.state.running = false;
    if (this.state.animationFrameId) {
      cancelAnimationFrame(this.state.animationFrameId);
      this.state.animationFrameId = undefined;
    }
  }

  public setPlayerVelocityX(vx: number): void { 
    this.state.player.velocityX = vx * this.scaleFactor; 
  }
  public getPlayerVelocityX(): number { return this.state.player.velocityX / this.scaleFactor; } 
  public setPlayerFacingDirection(isRight: boolean): void { this.state.player.facingRight = isRight; }
  public setTouchControlsPressed(isPressed: boolean, direction: number): void {
    this.state.touchControls.isPressed = isPressed;
    this.state.touchControls.direction = direction;
  }
  public setGyroControlsEnabled(enabled: boolean): void { this.state.gyroControls.enabled = enabled; }
  public isGyroControlsEnabled(): boolean { return this.state.gyroControls.enabled; }
  public setGyroCalibration(gamma: number): void { this.state.gyroControls.calibration = gamma; }
  public getGyroCalibration(): number { return this.state.gyroControls.calibration; }
  public getGyroSensitivity(): number { return this.state.gyroControls.sensitivity; }
  public isGameOver(): boolean { return this.state.gameOver; }
}