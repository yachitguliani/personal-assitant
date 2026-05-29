"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  label: string;
  active: boolean;
}

export function VectorViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodeCount, setNodeCount] = useState(24);
  const [connections, setConnections] = useState(48);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 40;

    const labels = [
      "Core Network", "Personal Routine", "Auth Token", "FastAPI Service", 
      "Next.js App", "NLP Model", "Postgres Embeddings", "Vector Schema", 
      "Synaptic Node", "User Context", "Agent Executive", "Life Goal #1"
    ];

    // Resize canvas
    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      particles = [];
      const count = Math.min(maxParticles, Math.floor((canvas.width * canvas.height) / 15000) + 10);
      setNodeCount(count);
      
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2 + 1.5;
        const color = Math.random() > 0.4 ? "rgba(0, 255, 255, 0.7)" : "rgba(168, 85, 247, 0.7)";
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius,
          color,
          label: labels[Math.floor(Math.random() * labels.length)],
          active: Math.random() > 0.8,
        });
      }
    };

    initParticles();

    // Mouse interactive coords
    let mouse = { x: -9999, y: -9999 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid line overlay
      ctx.strokeStyle = "rgba(0, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      let connectionCount = 0;

      // Update and draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            connectionCount++;
            const alpha = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = p1.color === p2.color && p1.color.includes("168")
              ? `rgba(168, 85, 247, ${alpha})`
              : `rgba(0, 255, 255, ${alpha})`;
            
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Render nodes
      particles.forEach((p) => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Boundaries bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse hover interaction
        const mdx = mouse.x - p.x;
        const mdy = mouse.y - p.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        const isHovered = mdist < 60;

        // Node Glow
        if (isHovered || p.active) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = isHovered ? "rgba(255, 255, 255, 0.9)" : p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, isHovered ? p.radius + 1.5 : p.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // reset

        // Draw connecting mouse laser lines
        if (isHovered) {
          ctx.strokeStyle = "rgba(0, 255, 255, 0.25)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          // Render miniature holographic node text
          ctx.fillStyle = "rgba(0, 255, 255, 0.8)";
          ctx.font = "8px 'Share Tech Mono', monospace";
          ctx.fillText(p.label, p.x + 8, p.y - 2);
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
          ctx.fillText(`COORD: [${Math.floor(p.x)}, ${Math.floor(p.y)}]`, p.x + 8, p.y + 7);
        }
      });

      setConnections(connectionCount);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[220px] bg-black/60 rounded-xl overflow-hidden border border-white/5 shadow-inner">
      <canvas ref={canvasRef} className="absolute inset-0 block cursor-crosshair" />

      {/* Holographic Header Panel */}
      <div className="absolute top-3 left-4 pointer-events-none select-none font-mono text-[10px] tracking-widest text-cyber-cyan/50 flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 font-bold text-cyber-cyan text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
          SYNAPTIC VECTOR CARTOGRAPHY
        </span>
        <span>MAPPED DIMENSIONAL CLUSTERS: 1536</span>
      </div>

      {/* Interactive HUD Readouts */}
      <div className="absolute bottom-3 right-4 pointer-events-none select-none font-mono text-[9px] tracking-wider text-white/40 flex gap-4">
        <div>
          NODES: <span className="text-cyber-cyan font-bold">{nodeCount}</span>
        </div>
        <div>
          VECTORS: <span className="text-cyber-purple font-bold">{connections}</span>
        </div>
        <div>
          GRID: <span className="text-white/60">ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
