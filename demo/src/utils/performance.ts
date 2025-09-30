/**
 * Performance monitoring utilities
 */

export class FPSCounter {
  private frames: number[] = [];
  private lastTime: number = performance.now();
  private fps: number = 60;
  
  update(): number {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    this.frames.push(1000 / delta);
    
    // Keep only last 60 frames
    if (this.frames.length > 60) {
      this.frames.shift();
    }
    
    // Calculate average FPS
    this.fps = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    
    return Math.round(this.fps);
  }
  
  getFPS(): number {
    return Math.round(this.fps);
  }
  
  reset(): void {
    this.frames = [];
    this.lastTime = performance.now();
    this.fps = 60;
  }
}

export function measureRenderTime(name: string): () => void {
  const start = performance.now();
  
  return () => {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  };
}