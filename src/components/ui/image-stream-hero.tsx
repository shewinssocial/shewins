"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type CorridorPath = {
  /** Strength of the projection. Lower is a wider-angle, more dramatic rush. @default 26 */
  perspective?: number;
  /** Card width in world units. @default 24 */
  cardWidth?: number;
  /** Card height in world units. @default 32 */
  cardHeight?: number;
  /** Corner radius applied to each card. @default 0.8 */
  cardRadius?: number;
  /** On-screen card height at the waist, where a card is born. @default 3.2 */
  birthHeight?: number;
  /** On-screen card height as a card leaves the frame. @default 58 */
  exitHeight?: number;
  /**
   * Lateral offset at birth. Negative starts the card across the axis so the
   * centre never opens up. @default -8
   */
  railBirth?: number;
  /** Lateral offset once the rails have finished opening. 2x extra width expansion. @default 58 */
  railExit?: number;
  /** How front-loaded the opening is. >1 opens early then holds. @default 3.2 */
  fan?: number;
  /** Y-rotation at birth, degrees. @default 6 */
  turnBirth?: number;
  /** Y-rotation at exit, degrees. @default 32 */
  turnExit?: number;
  /** Keyframe stops used to trace the curve. @default 24 */
  stops?: number;
};

const PATH: Required<CorridorPath> = {
  perspective: 26,
  cardWidth: 24,
  cardHeight: 32,
  cardRadius: 0.8,
  birthHeight: 3.2,
  exitHeight: 58,
  railBirth: -8,
  railExit: 58,
  fan: 3.2,
  turnBirth: 6,
  turnExit: 32,
  stops: 24,
};

/** Compute card transform and opacity at parametric position u in [0, 1] */
function computeCardState(u: number, dir: 1 | -1, p: Required<CorridorPath>) {
  const safeU = Math.max(0, Math.min(u, 1.15));
  const scale =
    (p.birthHeight / p.cardHeight) *
    Math.pow(p.exitHeight / p.birthHeight, safeU);
  const z = p.perspective * (1 - 1 / scale);
  const rail =
    p.railExit - (p.railExit - p.railBirth) * Math.pow(Math.max(0, 1 - safeU), p.fan);
  const turn = p.turnBirth + (p.turnExit - p.turnBirth) * safeU;

  let opacity = 1;
  if (u < 0.12) {
    opacity = Math.max(0, (u - 0.02) / 0.1);
  } else if (u > 0.98) {
    opacity = Math.max(0, 1 - (u - 0.98) / 0.14);
  }

  return {
    transform: `translate3d(${(dir * rail).toFixed(2)}cqw, 0, ${z.toFixed(
      2,
    )}cqw) rotateY(${(-dir * turn).toFixed(2)}deg)`,
    opacity,
  };
}

/** Sample the path once so the CSS keyframes trace the real curve (for auto mode fallback) */
function keyframes(dir: 1 | -1, name: string, p: Required<CorridorPath>) {
  const steps: string[] = [];
  for (let s = 0; s <= p.stops; s++) {
    const u = s / p.stops;
    const { transform } = computeCardState(u, dir, p);
    steps.push(`${(u * 100).toFixed(2)}%{transform:${transform}}`);
  }
  return `@keyframes ${name}{${steps.join("")}}`;
}

export type StreamImage = {
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
  category?: string;
};

export type ImageStreamHeroProps = {
  images: StreamImage[];
  cards?: number;
  speed?: number;
  axis?: number;
  path?: CorridorPath;
  children?: React.ReactNode;
  className?: string;
  /** Scroll progress in [0, 1]. When provided, component runs in Scroll-Triggered mode */
  progress?: number;
  /** Callback when the active centered image changes during scroll */
  onActiveIndexChange?: (index: number) => void;
};

export function ImageStreamHero({
  images,
  cards = 9,
  speed = 18,
  axis = 52,
  path,
  children,
  className,
  progress,
  onActiveIndexChange,
  ...props
}: React.ComponentProps<"div"> & ImageStreamHeroProps) {
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const right = `ish-r-${id}`;
  const left = `ish-l-${id}`;
  const card = `ish-c-${id}`;

  const p = React.useMemo(() => ({ ...PATH, ...path }), [path]);

  const isScrollDriven = typeof progress === "number";

  // Notify parent of active image index
  React.useEffect(() => {
    if (isScrollDriven && images.length > 0 && onActiveIndexChange) {
      const activeIdx = Math.min(
        Math.max(0, Math.round(progress * (images.length - 1))),
        images.length - 1,
      );
      onActiveIndexChange(activeIdx);
    }
  }, [progress, isScrollDriven, images.length, onActiveIndexChange]);

  const css = React.useMemo(() => {
    if (isScrollDriven) return "";
    return (
      `${keyframes(1, right, p)}${keyframes(-1, left, p)}` +
      `@media(prefers-reduced-motion:reduce){.${card}{animation-play-state:paused}}`
    );
  }, [isScrollDriven, right, left, card, p]);

  return (
    <div
      className={cn("relative overflow-hidden select-none", className)}
      {...props}
      style={{ containerType: "inline-size", ...props.style }}
    >
      {css && <style>{css}</style>}

      {/* 3D Corridor Scene Viewport */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          perspective: `${p.perspective}cqw`,
          perspectiveOrigin: `50% ${axis}%`,
        }}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ── 3D FLOOR TEXT (Minimal small-pixel text in brand pink placed flat on the ground) ── */}
          <div
            className="absolute pointer-events-none select-none flex items-center justify-center will-change-transform z-0"
            style={{
              left: "50%",
              top: `${axis + 14}%`,
              transform: "translate(-50%, 0) rotateX(75deg) translateZ(-6cqw)",
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#d81b60]/25 bg-[#fdfbf7]/80 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d81b60] inline-block" />
              <span
                className="font-display font-bold uppercase tracking-[0.25em]"
                style={{
                  fontSize: "13px",
                  color: "#d81b60",
                  lineHeight: 1,
                }}
              >
                SeaWINS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d81b60] inline-block" />
            </div>
          </div>

          {/* ── ZIGZAG 3D CARD RAILS ── */}
          {isScrollDriven ? (
            /* Scroll-Driven Mode: Alternating Zigzag Images & Editorial Info Cards */
            (() => {
              const count = images.length;
              const head = (progress ?? 0) * Math.max(1, count - 1);

              return images.map((img, i) => {
                const dist = i - head;
                // Prime viewing focal depth is u ≈ 0.72. Ahead cards queue into the distance; passed cards sweep outward.
                const u = dist >= 0 ? 0.72 - dist * 0.17 : 0.72 - dist * 0.36;

                // Cull cards far outside visible bounds
                if (u < -0.05 || u > 1.25) return null;

                // Zigzag determination:
                // Even index (0, 2, 4...) -> Image on RIGHT (1), Info on LEFT (-1)
                // Odd index (1, 3, 5...)  -> Image on LEFT (-1), Info on RIGHT (1)
                const imageDir: 1 | -1 = i % 2 === 0 ? 1 : -1;
                const textDir: 1 | -1 = i % 2 === 0 ? -1 : 1;

                const imageState = computeCardState(u, imageDir, p);
                const textState = computeCardState(u, textDir, p);

                const hasInfo = Boolean(img.title || img.caption || img.category);

                return (
                  <React.Fragment key={`zigzag-pair-${i}`}>
                    {/* 1. The Image Card on its Zigzag Rail */}
                    <div
                      className={cn(card, "absolute overflow-hidden shadow-2xl transition-opacity duration-150")}
                      style={{
                        left: "50%",
                        top: `${axis}%`,
                        width: `${p.cardWidth}cqw`,
                        height: `${p.cardHeight}cqw`,
                        marginLeft: `${-p.cardWidth / 2}cqw`,
                        marginTop: `${-p.cardHeight / 2}cqw`,
                        borderRadius: `${p.cardRadius}cqw`,
                        transform: imageState.transform,
                        opacity: imageState.opacity,
                        backfaceVisibility: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.6)",
                      }}
                    >
                      <img
                        src={img.src}
                        alt={img.alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>

                    {/* 2. The Complementary Editorial Info Card on the Opposite Rail */}
                    {hasInfo && (
                      <div
                        className={cn(card, "absolute overflow-hidden shadow-2xl transition-opacity duration-150")}
                        style={{
                          left: "50%",
                          top: `${axis}%`,
                          width: `${p.cardWidth}cqw`,
                          height: `${p.cardHeight}cqw`,
                          marginLeft: `${-p.cardWidth / 2}cqw`,
                          marginTop: `${-p.cardHeight / 2}cqw`,
                          borderRadius: `${p.cardRadius}cqw`,
                          transform: textState.transform,
                          opacity: textState.opacity,
                          backfaceVisibility: "hidden",
                          border: "1px solid rgba(255, 255, 255, 0.7)",
                        }}
                      >
                        <div className="w-full h-full bg-[#fdfbf7]/95 backdrop-blur-md p-5 sm:p-7 md:p-8 flex flex-col justify-between border border-[#8C4B56]/15 shadow-xl select-none">
                          <div className="flex-1 flex flex-col justify-center">
                            {/* Event Badge */}
                            {img.category ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[1.4cqw] sm:text-xs font-semibold uppercase tracking-widest bg-rose-50 text-[#d81b60] border border-rose-200/80 mb-3 self-start">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#d81b60]" />
                                {img.category}
                              </span>
                            ) : null}

                            {/* Title */}
                            {img.title ? (
                              <h3 className="font-display font-bold text-[2.5cqw] sm:text-2xl text-ink leading-snug mb-2 line-clamp-2">
                                {img.title}
                              </h3>
                            ) : null}

                            {/* Description */}
                            {img.caption ? (
                              <p className="text-[1.6cqw] sm:text-sm text-ink-soft leading-relaxed line-clamp-4 font-body">
                                {img.caption}
                              </p>
                            ) : null}
                          </div>

                          {/* Footer Indicator */}
                          <div className="flex items-center justify-between border-t border-ink/10 pt-3 mt-2">
                            <span className="text-[1.3cqw] sm:text-[11px] font-mono font-semibold tracking-wider text-rose-500 uppercase">
                              {String(i + 1).padStart(2, "0")} // Exhibition
                            </span>
                            <span className="text-[1.2cqw] sm:text-[10px] tracking-widest uppercase text-ink-faint">
                              SeaWINS
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              });
            })()
          ) : (
            /* Auto-mode Fallback */
            [1, -1].map((dir) => {
              const name = dir === 1 ? right : left;
              return Array.from({ length: cards }, (_, i) => {
                const img = images[i % Math.max(images.length, 1)];
                return (
                  <div
                    key={`${name}-${i}`}
                    className={cn(card, "absolute overflow-hidden shadow-2xl")}
                    style={{
                      left: "50%",
                      top: `${axis}%`,
                      width: `${p.cardWidth}cqw`,
                      height: `${p.cardHeight}cqw`,
                      marginLeft: `${-p.cardWidth / 2}cqw`,
                      marginTop: `${-p.cardHeight / 2}cqw`,
                      borderRadius: `${p.cardRadius}cqw`,
                      animation: `${name} ${speed}s linear infinite`,
                      animationDelay: `${-(i * speed) / cards}s`,
                      backfaceVisibility: "hidden",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                    }}
                  >
                    {img ? (
                      <img
                        src={img.src}
                        alt={img.alt ?? ""}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : null}
                  </div>
                );
              });
            })
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export default ImageStreamHero;
