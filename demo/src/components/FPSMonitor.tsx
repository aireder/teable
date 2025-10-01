/**
 * FPS Monitor component for performance tracking
 */

import { useEffect, useState, useRef } from 'react';
import { FPSCounter } from '../utils/performance';

export function FPSMonitor() {
  const [fps, setFps] = useState(60);
  const counterRef = useRef(new FPSCounter());
  const animationFrameRef = useRef<number>();
  
  useEffect(() => {
    const updateFPS = () => {
      const currentFps = counterRef.current.update();
      setFps(currentFps);
      animationFrameRef.current = requestAnimationFrame(updateFPS);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateFPS);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  const fpsColor = fps >= 55 ? 'text-green-500' : fps >= 30 ? 'text-yellow-500' : 'text-red-500';
  
  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg font-mono text-sm z-50">
      <div className="flex items-center gap-2">
        <span>FPS:</span>
        <span className={`font-bold ${fpsColor}`}>{fps}</span>
      </div>
    </div>
  );
}