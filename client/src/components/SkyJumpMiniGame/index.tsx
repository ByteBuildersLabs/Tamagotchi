import React, { useEffect, useRef } from 'react';
import platformImg from '../../assets/SkyJump/platform.png';
import bgImage1 from '../../assets/SkyJump/sky-bg.gif';
import bgImage2 from '../../assets/SkyJump/sky-bg-2.gif';
import bgImage3 from '../../assets/SkyJump/night-bg.gif';
import bgImage4 from '../../assets/SkyJump/space-bg.gif';
import bgImage5 from '../../assets/SkyJump/space-bg-2.gif';

// Estilo para el contenedor principal del juego
const gameContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };
  
  // Estilo para el contenedor del canvas
  const canvasContainerStyle: React.CSSProperties = {
    position: 'relative',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
  };
  
  const DoodleGame = ({ 
    className = '', 
    style = {}, 
    onScoreUpdate, 
    onGameEnd,
    beastImageRight,
    beastImageLeft
  }: { 
    className?: string, 
    style?: React.CSSProperties, 
    onScoreUpdate?: (score: number) => void,
    onGameEnd?: (score: number) => void,
    beastImageRight?: string,
    beastImageLeft?: string
  }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    const gameRef = useRef({
      // Dimensiones del canvas
      boardWidth: 360,
      boardHeight: 576,
  
      // Propiedades de la cámara
      cameraY: 0,
  
      // Propiedades del doodler
      doodlerWidth: 46,
      doodlerHeight: 46,
      doodler: {
        img: null as HTMLImageElement | null,
        x: 0,
        y: 0,
        worldY: 0,
        width: 60,
        height: 60,
      },
  
      // Propiedades de las plataformas
      platformWidth: 60,
      platformHeight: 18,
      platforms: [] as any[],
  
      // Física
      velocityX: 0,
      velocityY: 0,
      initialVelocityY: -2.5,
      gravity: 0.03,
  
      // Estado del juego
      score: 0,
      maxScore: 0,
      gameOver: false,
      endNotified: false, // Flag para evitar múltiples notificaciones de fin de juego
      animationFrameId: 0,
  
      // Imágenes
      doodlerRightImg: new Image(),
      doodlerLeftImg: new Image(),
      platformImg: new Image(),
  
      // Sistema de puntuación
      touchedPlatforms: new Set() as Set<string>,
  
      // Backgrounds (cada uno tiene un umbral de puntuación)
      backgrounds: {
        current: 0,
        images: [
          { img: bgImage1, scoreThreshold: 0 },
          { img: bgImage2, scoreThreshold: 5 },
          { img: bgImage3, scoreThreshold: 10 },
          { img: bgImage4, scoreThreshold: 15 },
          { img: bgImage5, scoreThreshold: 20 },
        ],
      },
    });
  
    useEffect(() => {
      const game = gameRef.current;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      // Función para ajustar el tamaño del juego al viewport
      const adjustGameSize = () => {
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Mantener la proporción original pero ajustar al viewport
        const aspectRatio = game.boardWidth / game.boardHeight;
        
        if (viewportWidth / viewportHeight > aspectRatio) {
            // Viewport más ancho que alto - ajustar por altura
            const scaleFactor = viewportHeight * 0.9 / game.boardHeight;
            canvas.style.height = `${game.boardHeight * scaleFactor}px`;
            canvas.style.width = `${game.boardWidth * scaleFactor}px`;
        } else {
            // Viewport más alto que ancho - ajustar por anchura
            const scaleFactor = viewportWidth * 0.9 / game.boardWidth;
            canvas.style.width = `${game.boardWidth * scaleFactor}px`;
            canvas.style.height = `${game.boardHeight * scaleFactor}px`;
        }
      };

      // Ajustar tamaño inicialmente
      adjustGameSize();
        
      // Ajustar cuando cambie el tamaño de la ventana
      window.addEventListener('resize', adjustGameSize);
  
      // Inicialización del doodler
      game.doodler.x = game.boardWidth / 2 - game.doodlerWidth / 2;
      game.doodler.y = (game.boardHeight * 7) / 8 - game.doodlerHeight;
      game.doodler.worldY = game.doodler.y;
  
      // Cargar imágenes
      game.doodlerRightImg.src = beastImageRight || '';
      game.doodlerLeftImg.src = beastImageLeft || '';
      game.platformImg.src = platformImg;
      game.doodler.img = game.doodlerRightImg;
      game.velocityY = game.initialVelocityY;
  
      // Actualiza el fondo según la puntuación
      const updateBackground = (score: number) => {
        let newBackgroundIndex = 0;
        for (let i = game.backgrounds.images.length - 1; i >= 0; i--) {
          if (score >= game.backgrounds.images[i].scoreThreshold) {
            newBackgroundIndex = i;
            break;
          }
        }
        if (game.backgrounds.current !== newBackgroundIndex) {
          game.backgrounds.current = newBackgroundIndex;
          canvas.style.backgroundImage = `url(${game.backgrounds.images[newBackgroundIndex].img})`;
        }
      };
  
      // ... Resto del código del juego ...
      // (Mantenemos el código del juego igual que en el original)
  
      const placePlatforms = () => {
        game.platforms = [];
        // Plataforma inicial
        game.platforms.push({
          img: game.platformImg,
          x: game.boardWidth / 2 - game.platformWidth / 2,
          y: game.boardHeight - 50,
          worldY: game.boardHeight - 50,
          width: game.platformWidth,
          height: game.platformHeight,
        });
        // Plataformas adicionales
        for (let i = 0; i < 6; i++) {
          let randomX = Math.floor(Math.random() * (game.boardWidth * 0.75));
          let worldY = game.boardHeight - 75 * i - 150;
          game.platforms.push({
            img: game.platformImg,
            x: randomX,
            y: worldY,
            worldY: worldY,
            width: game.platformWidth,
            height: game.platformHeight,
          });
        }
      };
  
      const newPlatform = () => {
        let randomX = Math.floor(Math.random() * (game.boardWidth * 0.75));
        const baseGap = 75;
        const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
        const gapIncrement = game.score * 0.2 * difficultyMultiplier;
        let worldY =
          game.platforms[game.platforms.length - 1].worldY -
          (baseGap + gapIncrement);
        return {
          img: game.platformImg,
          x: randomX,
          y: worldY - game.cameraY,
          worldY: worldY,
          width: game.platformWidth,
          height: game.platformHeight,
        };
      };
  
      const detectCollision = (a: any, b: any) => {
        return (
          a.x < b.x + b.width &&
          a.x + a.width > b.x &&
          a.worldY < b.worldY + b.height &&
          a.worldY + a.height > b.worldY
        );
      };
  
      const updateScore = (platform: any) => {
        const platformId = `${platform.worldY}`;
        if (!game.touchedPlatforms.has(platformId)) {
          game.score += 1;
          game.maxScore = Math.max(game.score, game.maxScore);
          game.touchedPlatforms.add(platformId);
          updateBackground(game.score);
          
          // Notificar al componente padre sobre la actualización de la puntuación
          if (onScoreUpdate) {
            onScoreUpdate(game.score);
          }
        }
      };
  
      const updateCamera = () => {
        const cameraThreshold = 150;
        game.doodler.y = game.doodler.worldY - game.cameraY;
        if (game.doodler.y < cameraThreshold) {
          const diff = cameraThreshold - game.doodler.y;
          game.cameraY -= diff;
        }
        game.platforms.forEach((platform) => {
          platform.y = platform.worldY - game.cameraY;
        });
        game.doodler.y = game.doodler.worldY - game.cameraY;
      };
  
      // Función auxiliar para dibujar un rectángulo redondeado
      const roundRect = (
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        fill: boolean,
        stroke: boolean
      ) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        if (fill) ctx.fill();
        if (stroke) ctx.stroke();
      };
  
      // Función para dibujar la tarjeta de puntuación en el canvas
      const drawScoreCard = () => {
        const cardX = 5;
        const cardY = 5;
        const cardWidth = 60;
        const cardHeight = 30;
        const radius = 10;
  
        // Fondo semitransparente del card
        context.fillStyle = "rgba(255, 255, 255, 0.8)";
        roundRect(context, cardX, cardY, cardWidth, cardHeight, radius, true, false);
  
        // Borde del card
        context.strokeStyle = "black";
        roundRect(context, cardX, cardY, cardWidth, cardHeight, radius, false, true);
  
        // Texto de la puntuación centrado
        context.fillStyle = "black";
        context.font = "16px sans-serif";
        const text = game.score.toString();
        const textWidth = context.measureText(text).width;
        const textX = cardX + (cardWidth - textWidth) / 2;
        const textY = cardY + cardHeight / 2 + 6; // Ajuste vertical aproximado
        context.fillText(text, textX, textY);
      };
  
      const update = () => {
        if (game.gameOver) {
          context.fillStyle = "black";
          context.font = "16px sans-serif";
          context.fillText(
            "Game Over: Presiona 'Space' para Reiniciar",
            game.boardWidth / 7,
            (game.boardHeight * 7) / 8
          );
  
          // Notificar al componente padre sobre la puntuación final
          if (onScoreUpdate) {
            onScoreUpdate(game.score);
          }
          
          // Notificar que el juego ha terminado si onGameEnd está definido
          // y todavía no se ha notificado
          if (onGameEnd && !game.endNotified) {
            game.endNotified = true;
            onGameEnd(game.score);
          }
  
          game.animationFrameId = requestAnimationFrame(update);
          return;
        }
  
        context.clearRect(0, 0, game.boardWidth, game.boardHeight);
  
        // Actualiza la posición horizontal del doodler
        game.doodler.x += game.velocityX;
        if (game.doodler.x > game.boardWidth) {
          game.doodler.x = 0;
        } else if (game.doodler.x + game.doodler.width < 0) {
          game.doodler.x = game.boardWidth;
        }
  
        // Ajusta la física vertical
        const difficultyMultiplier = 1 + game.backgrounds.current * 0.2;
        const currentGravity = game.gravity * difficultyMultiplier;
        game.velocityY = Math.min(game.velocityY + currentGravity, 8);
        game.doodler.worldY += game.velocityY;
  
        updateCamera();
  
        // Comprueba si se produjo Game Over
        if (game.doodler.worldY > game.cameraY + game.boardHeight) {
          game.gameOver = true;
        }
  
        // Dibuja y verifica colisiones con cada plataforma
        for (let i = 0; i < game.platforms.length; i++) {
          let platform = game.platforms[i];
          if (platform.y >= -platform.height && platform.y <= game.boardHeight) {
            context.drawImage(
              platform.img,
              platform.x,
              platform.y,
              platform.width,
              platform.height
            );
          }
          if (detectCollision(game.doodler, platform) && game.velocityY >= 0) {
            game.velocityY = game.initialVelocityY;
            game.doodler.worldY = platform.worldY - game.doodler.height;
            updateScore(platform);
          }
        }
  
        // Dibuja el doodler
        context.drawImage(
          game.doodler.img!,
          game.doodler.x,
          game.doodler.y,
          game.doodler.width,
          game.doodler.height
        );
  
        // Repone plataformas que salen de la vista
        while (
          game.platforms.length > 0 &&
          game.platforms[0].worldY > game.cameraY + game.boardHeight
        ) {
          game.platforms.shift();
          game.platforms.push(newPlatform());
        }
  
        // Dibuja la tarjeta (card) de la puntuación sobre el canvas
        drawScoreCard();
  
        game.animationFrameId = requestAnimationFrame(update);
      };
  
      const moveDoodler = (e: KeyboardEvent) => {
        if (e.code === "ArrowRight" || e.code === "KeyD") {
          game.velocityX = 4;
          game.doodler.img = game.doodlerRightImg;
        } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
          game.velocityX = -4;
          game.doodler.img = game.doodlerLeftImg;
        } else if (e.code === "Space" && game.gameOver) {
          // Reinicia el juego
          game.score = 0;
          game.maxScore = 0;
          game.touchedPlatforms.clear();
          game.backgrounds.current = 0;
          game.endNotified = false; // Resetea la bandera de notificación
          canvas.style.backgroundImage = `url(${game.backgrounds.images[0].img})`;
  
          if (game.animationFrameId) {
            cancelAnimationFrame(game.animationFrameId);
          }
  
          game.doodler = {
            img: game.doodlerRightImg,
            x: game.boardWidth / 2 - game.doodlerWidth / 2,
            y: (game.boardHeight * 7) / 8 - game.doodlerHeight,
            worldY: (game.boardHeight * 7) / 8 - game.doodlerHeight,
            width: game.doodlerWidth,
            height: game.doodlerHeight,
          };
  
          game.velocityX = 0;
          game.velocityY = game.initialVelocityY;
          game.gameOver = false;
          game.cameraY = 0;
          placePlatforms();
  
          game.animationFrameId = requestAnimationFrame(update);
        }
      };
  
      const stopDoodler = (e: KeyboardEvent) => {
        if ((e.code === "ArrowRight" || e.code === "KeyD") && game.velocityX > 0) {
          game.velocityX = 0;
        } else if ((e.code === "ArrowLeft" || e.code === "KeyA") && game.velocityX < 0) {
          game.velocityX = 0;
        }
      };
  
      placePlatforms();
      requestAnimationFrame(update);
      document.addEventListener("keydown", moveDoodler);
      document.addEventListener("keyup", stopDoodler);
  
      return () => {
        document.removeEventListener("keydown", moveDoodler);
        document.removeEventListener("keyup", stopDoodler);
        window.removeEventListener('resize', adjustGameSize);
        if (game.animationFrameId) {
          cancelAnimationFrame(game.animationFrameId);
        }
      };
    }, [beastImageRight, beastImageLeft]);
  
    // Mezclamos los estilos personalizados con los estilos predeterminados
    const containerMergedStyle = { ...gameContainerStyle, ...style };
  
    return (
        <div className={`doodle-game-container ${className}`} style={containerMergedStyle}>
        <div 
          style={{
            ...canvasContainerStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <canvas
            ref={canvasRef}
            width={gameRef.current.boardWidth}
            height={gameRef.current.boardHeight}
            style={{
              backgroundImage: `url(${bgImage1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "block",
              maxHeight: "95vh",
              objectFit: "contain"
            }}
          />
        </div>
      </div>
    );
  };
  
  export default DoodleGame;