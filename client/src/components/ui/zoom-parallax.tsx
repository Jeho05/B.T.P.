/**
 * Design system reminder — Matière & Maîtrise:
 * cinematic mineral layers that let the scroll reshape one architectural composition.
 * Geometry follows the seven-layer Zoom Parallax reference requested from 21st.
 */
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.56, 0.86, 1], [1, 1, 0.25, 0]);
  const overlayScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
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
        <div className="zoom-parallax__veil" aria-hidden="true" />
        <motion.div
          className="zoom-parallax__content"
          style={shouldReduceMotion ? undefined : { opacity: overlayOpacity, scale: overlayScale }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
