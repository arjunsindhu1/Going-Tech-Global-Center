import React, { useEffect, useRef } from 'react';

interface ParticleTextEffectProps {
  text: string;
  fontSize?: number;
  textColor?: string;
  particleColor?: string;
}

export default function ParticleTextEffect({ 
  text, 
  fontSize = 36, 
  textColor = '#081B8C',
  particleColor = 'rgba(47, 109, 255, 0.6)'
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    const padding = 20;
    
    // Set fixed dimensions for this decorative heading banner
    const width = (canvas.width = 650);
    const height = (canvas.height = 80);

    // Setup temporary canvas to render text and scan pixels
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Draw text to offscreen canvas to scan its pixel map
    tempCtx.fillStyle = '#000000';
    tempCtx.font = `900 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;
    tempCtx.textBaseline = 'middle';
    tempCtx.textAlign = 'center';
    tempCtx.fillText(text, width / 2, height / 2);

    const imgData = tempCtx.getImageData(0, 0, width, height);
    const pixels = imgData.data;

    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      density: number;
      radius: number;

      constructor(x: number, y: number) {
        // Start scattered
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = Math.random() * 1.5 + 1.0;
        // Speed/resistance variable
        this.density = Math.random() * 15 + 5;
      }

      update(mouse: { x: number; y: number }) {
        // Calculate distance to mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        
        // Interaction radius
        const maxDistance = 75;

        if (distance < maxDistance) {
          // Force is higher when closer
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          
          // Move away from mouse
          this.vx -= Math.cos(angle) * force * 1.5;
          this.vy -= Math.sin(angle) * force * 1.5;
        } else {
          // Return home spring force
          const dxHome = this.baseX - this.x;
          const dyHome = this.baseY - this.y;
          
          this.vx += (dxHome / this.density) * 0.15;
          this.vy += (dyHome / this.density) * 0.15;
        }

        // Apply friction and move
        this.vx *= 0.88;
        this.vy *= 0.88;
        this.x += this.vx;
        this.y += this.vy;
      }

      draw(c: CanvasRenderingContext2D) {
        c.fillStyle = particleColor;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fill();
      }
    }

    const particles: Particle[] = [];
    const step = 4; // Scan every 4th pixel for fluid performance

    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const index = (y * width + x) * 4;
        const alpha = pixels[index + 3];
        if (alpha > 128) { // If pixel is drawn
          particles.push(new Particle(x, y));
        }
      }
    }

    // Keep track of local mouse coordinate inside canvas bounds
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // Account for potential canvas scaling
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      mouse.x = (e.clientX - rect.left) * scaleX;
      mouse.y = (e.clientY - rect.top) * scaleY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw very faint text placeholder behind for absolute legibility
      ctx.fillStyle = 'rgba(8, 27, 140, 0.05)';
      ctx.font = `900 ${fontSize}px "Space Grotesk", "Inter", sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(text, width / 2, height / 2);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouse);
        particles[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, fontSize, particleColor]);

  return (
    <div className="flex justify-center items-center overflow-hidden h-[90px] w-full max-w-[650px] mx-auto bg-transparent relative">
      <canvas 
        ref={canvasRef} 
        className="block cursor-default max-w-full"
        style={{ width: '650px', height: '80px' }}
      />
    </div>
  );
}
