"use client";

import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
}

export function ScoreRing({ score, size = 80 }: ScoreRingProps) {
  const radius = (size - 18) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = "text-emerald-400";
  let glowClass = "drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]";
  if (score < 50) {
    colorClass = "text-rose-500";
    glowClass = "drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]";
  } else if (score < 80) {
    colorClass = "text-amber-400";
    glowClass = "drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]";
  }

  return (
    <div className="relative flex flex-col items-center justify-center shrink-0">
      <div className={`relative flex items-center justify-center ${glowClass}`} style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-white/10 stroke-current"
            strokeWidth="7"
            fill="transparent"
          />
          {/* Animated Score Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} stroke-current transition-all duration-1000 ease-out`}
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        {/* Centered Large Score Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl md:text-3xl font-black tracking-tight ${colorClass}`}>{score}</span>
        </div>
      </div>
      {/* Crisp Label Below */}
      <span className="text-[11px] font-bold tracking-widest uppercase text-slate-300 mt-1.5 font-mono">
        VibeScore
      </span>
    </div>
  );
}
