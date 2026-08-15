/**
 * Design system reminder — Matière & Maîtrise:
 * cinematic mineral layers that let the scroll reshape one architectural composition.
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

const layerClasses = [
  "zoom-parallax__layer--hero",
  "zoom-parallax__layer--northwest",
  "zoom-parallax__layer--west",
  "zoom-parallax__layer--east",
  "zoom-parallax__layer--southwest",
  "zoom-parallax__layer--south",
  "zoom-parallax__layer--southeast",
];

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
  const proofOpacity = useTransform(scrollYProgress, [0, 0.42, 0.72, 1], [0, 0, 0.9, 1]);
  const proofY = useTransform(scrollYProgress, [0.42, 1], [24, 0]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  return (
    <div ref={container} className={`zoom-parallax ${className}`}>
      <div className="zoom-parallax__sticky">
        <div className="zoom-parallax__layers" aria-hidden="true">
          {images.slice(0, 7).map(({ src, alt }, index) => (
            <motion.div
              key={src}
              style={shouldReduceMotion ? undefined : { scale: scales[index % scales.length] }}
              className={`zoom-parallax__layer ${layerClasses[index] ?? ""}`}
            >
              <div className="zoom-parallax__frame">
                <img src={src} alt={alt ?? ""} decoding="async" fetchPriority={index === 0 ? "high" : "auto"} />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="zoom-parallax__veil" aria-hidden="true" />
        <motion.div className="zoom-parallax__proof" style={shouldReduceMotion ? undefined : { opacity: proofOpacity, y: proofY }} aria-hidden="true">
          <span>02 / PASSAGE DE MATIÈRE</span>
          <i />
          <strong>LE TERRAIN<br />PREND FORME.</strong>
          <small>AXE 04.27 / PREUVE DE CHANTIER</small>
        </motion.div>
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
