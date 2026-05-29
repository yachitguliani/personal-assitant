"use client";

import React, { forwardRef } from "react";

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  glowColor?: "cyan" | "purple";
}

export const NeonInput = forwardRef<HTMLInputElement, NeonInputProps>(
  ({ label, error, icon, glowColor = "cyan", className = "", ...props }, ref) => {
    const focusGlow = {
      cyan: "focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.15)]",
      purple: "focus:border-cyber-purple focus:shadow-[0_0_15px_rgba(168,85,247,0.15)]",
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-mono uppercase tracking-wider text-white/50">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-white/40 pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-black/40 border border-white/10 rounded-lg py-2.5 ${
              icon ? "pl-11" : "pl-4"
            } pr-4 text-sm font-sans placeholder-white/20 text-white outline-none transition-all duration-300 ${
              focusGlow[glowColor]
            } ${error ? "border-cyber-red/50 focus:border-cyber-red" : ""} ${className}`}
            {...props}
          />
        </div>
        {error && (
          <span className="text-[10px] font-mono text-cyber-red/80 mt-0.5 uppercase tracking-wide">
            {error}
          </span>
        )}
      </div>
    );
  }
);

NeonInput.displayName = "NeonInput";
