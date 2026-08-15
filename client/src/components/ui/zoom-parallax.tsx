/**
 * Design system reminder — Matière & Maîtrise:
 * cinematic mineral layers that let native scroll reshape one architectural composition.
 * This is the canonical 21st-style Zoom Parallax: Framer Motion tracks a 300vh container
 * and gives the seven layers their independent 4/5/6/5/6/8/9 scales.
 */
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { type ReactNode, useRef } from "react";

interface ZoomParallaxImage {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: ZoomParallaxImage[];
  children: ReactNode;
  className?: string;
}

const layerSpecs = [
  { className: "zoom-parallax__layer--hero", endScale: 4 },
  { className: "zoom-parallax__layer--northwest", endScale: 5 },
  { className: "zoom-parallax__layer--west", endScale: 6 },
  { className: "zoom-parallax__layer--east", endScale: 5 },
  { className: "zoom-parallax__layer--southwest", endScale: 6 },
  { className: "zoom-parallax__layer--south", endScale: 8 },
  { className: "zoom-parallax__layer--southeast", endScale: 9 },
] as const;

export function ZoomParallax({ images, children, className = "" }: ZoomParallaxProps) {
  const container = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // The reference component derives every scale from this single scroll progress value.
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const veilOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.56], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.56], [0, -68]);
  const scales: MotionValue<number>[] = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className={`zoom-parallax ${className}`} data-zoom-parallax>
      <div className="zoom-parallax__sticky">
        <div className="zoom-parallax__layers" aria-hidden="true">
          {images.slice(0, layerSpecs.length).map(({ src, alt }, index) => {
            const layer = layerSpecs[index];
            return (
              <motion.div
                key={src}
                data-zoom-layer={index + 1}
                data-zoom-target={layer.endScale}
                className={`zoom-parallax__layer ${layer.className}`}
                style={{ scale: shouldReduceMotion ? 1 : scales[index] }}
              >
                <div className="zoom-parallax__frame">
                  <img
                    src={src}
                    alt={alt ?? ""}
                    decoding="async"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          className="zoom-parallax__veil"
          aria-hidden="true"
          style={{ opacity: shouldReduceMotion ? 1 : veilOpacity }}
        />
        <motion.div
          className="zoom-parallax__content"
          style={{ opacity: shouldReduceMotion ? 1 : contentOpacity, y: shouldReduceMotion ? 0 : contentY }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
