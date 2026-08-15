/**
 * Design system reminder — Matière & Maîtrise:
 * cinematic mineral layers that let the scroll reshape one architectural composition.
 * Geometry follows the seven-layer Zoom Parallax reference requested from 21st.
 */
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
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
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const scrollProgress = useSpring(scrollYProgress, {
    damping: 26,
    mass: 0.34,
    stiffness: 92,
  });

  // The end values stay faithful to the 21st reference; the midpoints make the
  // depth legible before the visitor reaches the end of the pinned sequence.
  const scale4 = useTransform(scrollProgress, [0, 0.62, 1], [1, 3.62, 4]);
  const scale5 = useTransform(scrollProgress, [0, 0.62, 1], [1, 4.52, 5]);
  const scale6 = useTransform(scrollProgress, [0, 0.62, 1], [1, 5.42, 6]);
  const scale8 = useTransform(scrollProgress, [0, 0.62, 1], [1, 7.2, 8]);
  const scale9 = useTransform(scrollProgress, [0, 0.62, 1], [1, 8.1, 9]);
  const veilOpacity = useTransform(scrollProgress, [0, 0.15, 0.52, 0.82, 1], [1, 0.9, 0.54, 0.14, 0]);
  const contentOpacity = useTransform(scrollProgress, [0, 0.18, 0.45, 0.68], [1, 1, 0.58, 0]);
  const contentY = useTransform(scrollProgress, [0, 0.68], [0, -42]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className={`zoom-parallax ${className}`}>
      <div className="zoom-parallax__sticky">
        <div className="zoom-parallax__layers" aria-hidden="true">
          {images.slice(0, layerSpecs.length).map(({ src, alt }, index) => {
            const layer = layerSpecs[index];
            return (
              <motion.div
                key={src}
                data-zoom-layer={index + 1}
                data-zoom-target={layer.endScale}
                style={shouldReduceMotion ? undefined : { scale: scales[index] }}
                className={`zoom-parallax__layer ${layer.className}`}
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
          style={shouldReduceMotion ? undefined : { opacity: veilOpacity }}
          aria-hidden="true"
        />
        <motion.div
          className="zoom-parallax__content"
          style={shouldReduceMotion ? undefined : { opacity: contentOpacity, y: contentY }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
