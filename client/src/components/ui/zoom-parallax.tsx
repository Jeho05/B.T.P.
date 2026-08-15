/**
 * Design system reminder — Matière & Maîtrise:
 * cinematic mineral layers that let the scroll reshape one architectural composition.
 * Geometry follows the seven-layer Zoom Parallax reference requested from 21st.
 * Motion uses the same GSAP ScrollTrigger engine as the proven cinematic scenes.
 */
import { useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ReactNode, useLayoutEffect, useRef } from "react";

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

  useLayoutEffect(() => {
    const root = container.current;
    if (!root || shouldReduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>(".zoom-parallax__layer");
      const veil = root.querySelector<HTMLElement>(".zoom-parallax__veil");
      const content = root.querySelector<HTMLElement>(".zoom-parallax__content");

      gsap.set(layers, { force3D: true, transformOrigin: "50% 50%" });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      layers.forEach((layer, index) => {
        timeline.to(
          layer,
          { scale: layerSpecs[index].endScale, duration: 1, ease: "none", force3D: true },
          0,
        );
      });

      if (veil) timeline.to(veil, { autoAlpha: 0, duration: 0.76, ease: "none" }, 0.16);
      if (content) timeline.to(content, { autoAlpha: 0, yPercent: -18, duration: 0.6, ease: "none" }, 0.2);
    }, root);

    return () => context.revert();
  }, [shouldReduceMotion]);

  return (
    <div ref={container} className={`zoom-parallax ${className}`}>
      <div className="zoom-parallax__sticky">
        <div className="zoom-parallax__layers" aria-hidden="true">
          {images.slice(0, layerSpecs.length).map(({ src, alt }, index) => {
            const layer = layerSpecs[index];
            return (
              <div
                key={src}
                data-zoom-layer={index + 1}
                data-zoom-target={layer.endScale}
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
              </div>
            );
          })}
        </div>
        <div className="zoom-parallax__veil" aria-hidden="true" />
        <div className="zoom-parallax__content">
          {children}
        </div>
      </div>
    </div>
  );
}
