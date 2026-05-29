"use client";

import React from "react";
import { motion } from "framer-motion";

interface CyberButtonProps {
  children: React.ReactNode;
  variant?: "cyan" | "purple" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CyberButton({
  children,
  variant = "cyan",
  size = "md",
  glow = true,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}: CyberButtonProps) {
  const baseStyle = "relative font-mono uppercase tracking-wider transition-all duration-300 overflow-hidden flex items-center justify-center select-none active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-5 py-2.5 text-sm rounded-lg",
    lg: "px-8 py-3.5 text-base rounded-xl",
  };

  const variantStyles = {
    cyan: "bg-cyber-cyan-dark/30 hover:bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold",
    purple: "bg-cyber-purple-dark/30 hover:bg-cyber-purple/20 border border-cyber-purple text-cyber-purple font-bold",
    danger: "bg-red-950/30 hover:bg-red-500/20 border border-cyber-red text-cyber-red font-bold",
    ghost: "bg-transparent hover:bg-white/5 border border-white/10 text-white/70 hover:text-white",
  };

  const glowStyles = glow
    ? {
        cyan: "shadow-[0_0_12px_rgba(0,255,255,0.2)] hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]",
        purple: "shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]",
        danger: "shadow-[0_0_12px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]",
        ghost: "",
      }
    : { cyan: "", purple: "", danger: "", ghost: "" };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${glowStyles[variant]} ${className}`}
    >
      {/* Laser line flare animation */}
      <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[scanline_1.5s_ease-out_infinite]" />

      {/* Decorative corners */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-60" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-60" />

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
