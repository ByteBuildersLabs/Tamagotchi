import { GameEngine } from './gameEngine';
import { GYRO_TILT_THRESHOLD, GYRO_TILT_DIVISOR, PLAYER_HORIZONTAL_SPEED } from './gameConfig';

export class InputHandler {
  private gameEngine: GameEngine;
  private isMobileDevice: boolean = false;
  private usingGyroscope: boolean = false;
  private gyroscopePermission: PermissionState | null = null;
  private onToggleGyroscope?: (isUsing: boolean) => void; 

  constructor(gameEngine: GameEngine, onToggleGyroscope?: (isUsing: boolean) => void) {
    this.gameEngine = gameEngine;
    this.onToggleGyroscope = onToggleGyroscope;
    this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  public setupEventListeners(
      isMobile: boolean,
      initialUsingGyro: boolean,
      _gyroButton?: HTMLElement | null, 
      touchLeftButton?: HTMLElement | null,
      touchRightButton?: HTMLElement | null
    ): void {
    this.isMobileDevice = isMobile;
    this.usingGyroscope = initialUsingGyro && this.isMobileDevice;

    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);

    if (this.isMobileDevice) {
      if (touchLeftButton && touchRightButton) {
        touchLeftButton.addEventListener('touchstart', (e) => this.handleTouchStart(-1, e as TouchEvent), { passive: false });
        touchLeftButton.addEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent), { passive: false });
        touchRightButton.addEventListener('touchstart', (e) => this.handleTouchStart(1, e as TouchEvent), { passive: false });
        touchRightButton.addEventListener('touchend', (e) => this.handleTouchEnd(e as TouchEvent), { passive: false });
        touchLeftButton.addEventListener('contextmenu', e => e.preventDefault());
        touchRightButton.addEventListener('contextmenu', e => e.preventDefault());
      }

      if (this.usingGyroscope) this.requestOrientationPermissionInternal();
    }
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (this.gameEngine.isGameOver()) return;

    if (e.code === 'ArrowRight' || e.code === 'KeyD') {
      this.gameEngine.setPlayerVelocityX(PLAYER_HORIZONTAL_SPEED);
      this.gameEngine.setPlayerFacingDirection(true);
    } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
      this.gameEngine.setPlayerVelocityX(-PLAYER_HORIZONTAL_SPEED);
      this.gameEngine.setPlayerFacingDirection(false);
    }
  };

  private handleKeyUp = (e: KeyboardEvent): void => {
    if (this.gameEngine.isGameOver()) return;

    if (
      (e.code === 'ArrowRight' || e.code === 'KeyD') &&
      this.gameEngine.getPlayerVelocityX() > 0
    ) {
      this.gameEngine.setPlayerVelocityX(0);
    } else if (
      (e.code === 'ArrowLeft' || e.code === 'KeyA') &&
      this.gameEngine.getPlayerVelocityX() < 0
    ) {
      this.gameEngine.setPlayerVelocityX(0);
    }
  };

  private handleTouchStart = (direction: number, e: TouchEvent): void => {
    e.preventDefault();
    if (this.gameEngine.isGameOver() || this.usingGyroscope) return;
    this.gameEngine.setTouchControlsPressed(true, direction);
    if (direction === 1) {
      this.gameEngine.setPlayerVelocityX(PLAYER_HORIZONTAL_SPEED);
      this.gameEngine.setPlayerFacingDirection(true);
    } else if (direction === -1) {
      this.gameEngine.setPlayerVelocityX(-PLAYER_HORIZONTAL_SPEED);
      this.gameEngine.setPlayerFacingDirection(false);
    }
  };

  private handleTouchEnd = (e: TouchEvent): void => {
    e.preventDefault();
    if (this.gameEngine.isGameOver() || this.usingGyroscope) return;
    this.gameEngine.setTouchControlsPressed(false, 0);
    this.gameEngine.setPlayerVelocityX(0);
  };

  private requestOrientationPermissionInternal = async (): Promise<void> => {
    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        this.gyroscopePermission = permissionState;
        if (permissionState === 'granted') {
          this.gameEngine.setGyroControlsEnabled(true);
          this.usingGyroscope = true;
          window.addEventListener('deviceorientation', this.calibrateGyroscope, { once: true });
          window.addEventListener('deviceorientation', this.handleDeviceOrientation);
        } else {
          this.gameEngine.setGyroControlsEnabled(false);
          this.usingGyroscope = false;
        }
      } else {
        this.gyroscopePermission = 'granted';
        this.gameEngine.setGyroControlsEnabled(true);
        this.usingGyroscope = true;
        window.addEventListener('deviceorientation', this.calibrateGyroscope, { once: true });
        window.addEventListener('deviceorientation', this.handleDeviceOrientation);
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
      this.gyroscopePermission = 'denied';
      this.gameEngine.setGyroControlsEnabled(false);
      this.usingGyroscope = false;
    }
    if (this.onToggleGyroscope) this.onToggleGyroscope(this.usingGyroscope);
  };

  private calibrateGyroscope = (event: DeviceOrientationEvent): void => {
    if (event.gamma !== null) {
      this.gameEngine.setGyroCalibration(event.gamma);
    }
  };

  private handleDeviceOrientation = (event: DeviceOrientationEvent): void => {
    if (!this.gameEngine.isGyroControlsEnabled() || this.gameEngine.isGameOver() || event.gamma === null) {
      return;
    }
    const tilt = event.gamma - this.gameEngine.getGyroCalibration();
    const sensitivity = this.gameEngine.getGyroSensitivity();

    if (tilt > GYRO_TILT_THRESHOLD) {
      this.gameEngine.setPlayerVelocityX(Math.min((tilt / GYRO_TILT_DIVISOR) * sensitivity, PLAYER_HORIZONTAL_SPEED * 1.5));
      this.gameEngine.setPlayerFacingDirection(true);
    } else if (tilt < -GYRO_TILT_THRESHOLD) {
      this.gameEngine.setPlayerVelocityX(Math.max((tilt / GYRO_TILT_DIVISOR) * sensitivity, -PLAYER_HORIZONTAL_SPEED * 1.5));
      this.gameEngine.setPlayerFacingDirection(false);
    } else {
      this.gameEngine.setPlayerVelocityX(0);
    }
  };

  public toggleGyroscopeManually = (): void => {
    if (!this.isMobileDevice) return;

    if (this.usingGyroscope) {
      this.gameEngine.setGyroControlsEnabled(false);
      this.usingGyroscope = false;
      window.removeEventListener('deviceorientation', this.handleDeviceOrientation);
      window.removeEventListener('deviceorientation', this.calibrateGyroscope);
    } else {
      this.requestOrientationPermissionInternal();
    }
     if (this.onToggleGyroscope) this.onToggleGyroscope(this.usingGyroscope);
  };

  public isUsingGyroscope = (): boolean => this.usingGyroscope;


  public cleanupEventListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);

    if (this.isMobileDevice) {
      if (this.gameEngine.isGyroControlsEnabled()) {
        window.removeEventListener('deviceorientation', this.handleDeviceOrientation);
        window.removeEventListener('deviceorientation', this.calibrateGyroscope);
      }
    }
  }
}

