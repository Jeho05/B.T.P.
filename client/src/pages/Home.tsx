/**
 * Design system reminder — Matière & Maîtrise:
 * an editorial chantier traversal using sharp mineral planes, precise coordinates and Terre de Brique cues.
 */
import { useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Menu,
  MoveDown,
  Plus,
  X,
} from "lucide-react";

const ASSETS = {
  hero: "/manus-storage/btp-hero-cinematic_31a3c819.jpg",
  gestures: "/manus-storage/btp-gestures-matieres_3cdd355b.jpg",
  territory: "/manus-storage/btp-territoire-aerial_7d477380.jpg",
  facade: "/manus-storage/btp-facade-monolith_7bee3155.jpg",
  human: "/manus-storage/btp-human-craft_43150438.jpg",
  mark: "/manus-storage/btp-monolith-mark_55702eac.png",
  workersVideo: "/manus-storage/btp-workers-site-web_02cfdc5a.mp4",
  workersPoster: "/manus-storage/btp-workers-site-poster_123a0d66.jpg",
  aerialVideo: "/manus-storage/btp-aerial-site-web_e38502e1.mp4",
  aerialPoster: "/manus-storage/btp-aerial-site-poster_e6175a59.jpg",
};

const disciplines = [
  {
    index: "01",
    title: "Bâtir",
    text: "Donner une forme durable à une intention, du premier trait au dernier détail.",
  },
  {
    index: "02",
    title: "Transformer",
    text: "Révéler le potentiel d’un lieu, sans effacer ce qui lui donne son caractère.",
  },
  {
    index: "03",
    title: "Aménager",
    text: "Faire dialoguer les usages, les matières et les terrains pour créer des ensembles cohérents.",
  },
];

const processSteps = [
  ["01", "Écouter le terrain"],
  ["02", "Donner la bonne mesure"],
  ["03", "Conduire l’ouvrage"],
  ["04", "Livrer ce qui dure"],
];

export default function Home() {
  const page = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const videos = page.current?.querySelectorAll<HTMLVideoElement>(".scroll-video");
    if (!videos?.length) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;
        if (entry.isIntersecting) void video.play().catch(() => undefined);
        else video.pause();
      }),
      { threshold: 0.24 },
    );
    videos.forEach((video) => observer.observe(video));
    return () => {
      observer.disconnect();
      videos.forEach((video) => video.pause());
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const loadMotion = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.65 })
          .from(".hero-title span", { yPercent: 112, duration: 0.95, stagger: 0.1 }, "-=0.28")
          .from(".hero-copy", { y: 22, opacity: 0, duration: 0.7 }, "-=0.54")
          .from(".hero-meta", { y: 16, opacity: 0, duration: 0.55 }, "-=0.42");

        const heroScroll = gsap.timeline({
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
          },
        });
        heroScroll
          .to(".hero-photo", { scale: 1.15, yPercent: 13, ease: "none" }, 0)
          .to(".hero-inner", { yPercent: -17, ease: "none" }, 0)
          .to(".hero-meta", { y: 72, opacity: 0, ease: "none" }, 0)
          .to(".hero-shade", { opacity: 0.7, ease: "none" }, 0);

        gsap.fromTo(
          ".scroll-index-fill",
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            ease: "none",
            scrollTrigger: {
              trigger: "main",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.25,
            },
          },
        );

        gsap.utils.toArray<HTMLElement>(".reveal-group").forEach((group) => {
          gsap.from(group.children, {
            y: 40,
            opacity: 0,
            duration: 0.85,
            stagger: 0.11,
            ease: "power3.out",
            scrollTrigger: {
              trigger: group,
              start: "top 83%",
              once: true,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((image) => {
          gsap.fromTo(
            image,
            { clipPath: "inset(10% 0 10% 0)", scale: 1.08 },
            {
              clipPath: "inset(0% 0 0% 0)",
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: image, start: "top 80%", once: true },
            },
          );
        });

        gsap.to(".material-image", {
          yPercent: -11,
          rotation: -1.2,
          ease: "none",
          scrollTrigger: {
            trigger: ".material-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(".craft-proof", {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".craft-proof",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        const media = gsap.matchMedia();
        media.add("(min-width: 901px)", () => {
          const stage = document.querySelector<HTMLElement>(".terrain-scroll-stage");
          const track = document.querySelector<HTMLElement>(".terrain-track");

          if (stage && track) {
            gsap.to(track, {
              x: () => -(track.scrollWidth - stage.clientWidth),
              ease: "none",
              scrollTrigger: {
                trigger: stage,
                start: "top top",
                end: () => `+=${Math.max(track.scrollWidth - stage.clientWidth, 1)}`,
                pin: true,
                scrub: 0.9,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            gsap.fromTo(
              ".terrain-panel img, .terrain-panel video",
              { scale: 1.16 },
              {
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: stage,
                  start: "top top",
                  end: () => `+=${Math.max(track.scrollWidth - stage.clientWidth, 1)}`,
                  scrub: 0.9,
                },
              },
            );
          }

          const methodTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".method-section",
              start: "top top",
              end: "+=1250",
              pin: true,
              scrub: 0.85,
              anticipatePin: 1,
            },
          });
          methodTimeline
            .fromTo(".method-top", { xPercent: -18, opacity: 0.25 }, { xPercent: 0, opacity: 1, duration: 0.24 }, 0)
            .fromTo(".method-steps li", { y: 86, opacity: 0.2 }, { y: 0, opacity: 1, stagger: 0.18, duration: 0.5 }, 0.18)
            .to(".method-progress-fill", { scaleX: 1, transformOrigin: "left", duration: 0.95 }, 0)
            .to(".method-orbit", { rotate: 0, scale: 1, duration: 0.8 }, 0.08);
        });
        cleanup = () => {
          media.revert();
          context.revert();
        };
      }, page);
      cleanup ??= () => context.revert();
    };

    void loadMotion();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" ref={page} id="top">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand-lockup" href="#top" aria-label="B.T.P. — retour en haut de la page">
          <span className="brand-sign"><img src={ASSETS.mark} alt="" className="brand-mark" /></span>
          <span className="brand-type">B.T.P.</span>
          <span className="brand-rule" aria-hidden="true" />
        </a>

        <nav className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navigation principale">
          <a href="#vision" onClick={closeMenu}>Vision</a>
          <a href="#savoir-faire" onClick={closeMenu}>Savoir-faire</a>
          <a href="#terrains" onClick={closeMenu}>Terrains</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <a className="header-cta" href="#contact">
          <span>Parler projet</span>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={23} />}
        </button>
      </header>

      <aside className="scroll-index" aria-hidden="true">
        <span>00</span>
        <i><b className="scroll-index-fill" /></i>
        <span>05</span>
      </aside>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true">
            <img className="hero-photo" src={ASSETS.hero} alt="" />
            <div className="hero-shade" />
            <div className="hero-grain" />
          </div>
          <div className="hero-rule hero-rule-horizontal" aria-hidden="true" />
          <div className="hero-rule hero-rule-vertical" aria-hidden="true" />

          <div className="hero-inner">
            <p className="eyebrow hero-kicker"><span className="orange-dot" /> Depuis le terrain, pour le réel</p>
            <h1 className="hero-title" id="hero-title">
              <span>Ce qui compte</span>
              <span>se construit.</span>
            </h1>
            <div className="hero-copy">
              <p>Des ouvrages guidés par la précision du geste, la lecture du lieu et l’exigence de ce qui reste.</p>
              <a className="text-link text-link-light" href="#vision">
                Entrer dans l’ouvrage <ArrowDownRight aria-hidden="true" size={18} />
              </a>
            </div>
          </div>

          <div className="hero-meta">
            <p>Étude <span>·</span> Construction <span>·</span> Aménagement</p>
            <a className="scroll-cue" href="#vision" aria-label="Découvrir la suite">
              <MoveDown size={18} aria-hidden="true" />
              <span>Défiler</span>
            </a>
            <p className="hero-coordinate">45° 45′ N / 04° 50′ E</p>
          </div>
        </section>

        <section className="statement-section plan-section" data-plan="AXIS / 01 — 100" id="vision" aria-labelledby="vision-title">
          <div className="structural-sign" aria-hidden="true"><img src={ASSETS.mark} alt="" /><i /></div>
          <div className="section-index" aria-hidden="true">01 / vision</div>
          <div className="statement-layout reveal-group">
            <p className="eyebrow dark-eyebrow">Une entreprise de construction, jamais une formule</p>
            <h2 id="vision-title">À la mesure <em>du réel.</em></h2>
            <div className="statement-copy">
              <p>
                Chaque site impose sa géométrie, ses usages et son rythme. Nous en faisons le point de départ d’un ouvrage précis, tenu et habité.
              </p>
              <p>
                B.T.P. réunit le regard du terrain et la discipline de l’exécution pour faire passer une intention dans la matière.
              </p>
              <a className="text-link" href="#savoir-faire">Notre manière de construire <ArrowDownRight aria-hidden="true" size={18} /></a>
            </div>
          </div>
          <div className="statement-measure" aria-hidden="true"><span>100</span><i /></div>
        </section>

        <section className="material-section plan-section" data-plan="MAT / 02 — 45°" id="savoir-faire" aria-labelledby="material-title">
          <div className="structural-sign" aria-hidden="true"><img src={ASSETS.mark} alt="" /><i /></div>
          <div className="material-intro reveal-group">
            <div>
              <p className="eyebrow">02 / gestes & matières</p>
              <h2 id="material-title">Une méthode<br /><em>qui se voit.</em></h2>
            </div>
            <p>La justesse se joue dans les détails : un raccord, une ligne, une lumière, une matière laissée honnête.</p>
          </div>

          <div className="material-composition">
            <figure className="material-image image-reveal">
              <video className="scroll-video" muted loop playsInline preload="metadata" poster={ASSETS.workersPoster} aria-label="Ouvriers et engins sur un chantier en activité">
                <source src={ASSETS.workersVideo} type="video/mp4" />
              </video>
              <figcaption><span>Geste / 01</span><span>La matière en mouvement</span></figcaption>
            </figure>

            <div className="disciplines reveal-group">
              {disciplines.map((discipline) => (
                <article className="discipline" key={discipline.index}>
                  <span className="discipline-index">{discipline.index}</span>
                  <h3>{discipline.title}</h3>
                  <p>{discipline.text}</p>
                  <Plus className="discipline-plus" size={19} strokeWidth={1.4} aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>

          <aside className="craft-proof image-reveal" aria-label="La précision se construit aussi collectivement">
            <div className="craft-proof-copy">
              <p className="eyebrow"><span className="orange-dot" /> Collectif / 04</p>
              <p className="craft-number">04</p>
              <p>Le chantier est une conversation continue : une mesure relue, un geste transmis, une décision tenue ensemble.</p>
              <span className="craft-coordinate">N 45° / E 04° / ALIGNEMENT</span>
            </div>
            <img src={ASSETS.human} alt="Professionnels du chantier consultant ensemble un plan de construction" loading="lazy" decoding="async" />
          </aside>
        </section>

        <section className="terrain-section plan-section" data-plan="SCALE / 03 — R.12" id="terrains" aria-labelledby="terrain-title">
          <div className="structural-sign" aria-hidden="true"><img src={ASSETS.mark} alt="" /><i /></div>
          <div className="terrain-heading reveal-group">
            <p className="eyebrow dark-eyebrow">03 / échelle & territoire</p>
            <h2 id="terrain-title">Des lieux qui<br /><em>prennent position.</em></h2>
            <p>Nous intervenons là où l’architecture, le paysage et l’usage doivent former un tout lisible.</p>
          </div>

          <div className="terrain-scroll-stage">
            <div className="terrain-track">
              <article className="terrain-panel terrain-panel-wide image-reveal">
                <img src={ASSETS.territory} alt="Vue aérienne d’un aménagement paysager et d’une infrastructure contemporaine" loading="eager" decoding="async" />
                <div className="terrain-caption"><span>01 / Territoires</span><strong>Aménager les continuités</strong><ArrowUpRight size={20} aria-hidden="true" /></div>
              </article>
              <article className="terrain-panel terrain-panel-tall image-reveal">
                <img src={ASSETS.facade} alt="Façade monolithique d’un bâtiment contemporain en béton" loading="eager" decoding="async" />
                <div className="terrain-caption"><span>02 / Ouvrages</span><strong>Donner une présence au bâti</strong><ArrowUpRight size={20} aria-hidden="true" /></div>
              </article>
              <article className="terrain-panel terrain-panel-video image-reveal">
                <video className="scroll-video" muted loop playsInline preload="metadata" poster={ASSETS.aerialPoster} aria-label="Vue aérienne d’un chantier de construction en cours">
                  <source src={ASSETS.aerialVideo} type="video/mp4" />
                </video>
                <div className="terrain-caption"><span>03 / En cours</span><strong>Lire le chantier en mouvement</strong><ArrowUpRight size={20} aria-hidden="true" /></div>
              </article>
              <article className="terrain-manifesto" aria-label="Troisième échelle : l’usage">
                <span className="eyebrow"><i className="orange-dot" /> 04 / Usages</span>
                <strong>UN LIEU<br />QUI <em>continue.</em></strong>
                <p>Un ouvrage n’existe vraiment que lorsqu’il accompagne les usages qui suivent sa livraison.</p>
                <span className="terrain-manifesto-axis">R.04 / 45° / 100</span>
              </article>
            </div>
            <div className="terrain-scroll-meter" aria-hidden="true"><span>TRAVERSÉE</span><i /><span>01 — 04</span></div>
          </div>
        </section>

        <section className="method-section plan-section" data-plan="FLOW / 04 — 1:100" aria-labelledby="method-title">
          <div className="structural-sign" aria-hidden="true"><img src={ASSETS.mark} alt="" /><i /></div>
          <div className="method-orbit" aria-hidden="true"><span>04</span><i /></div>
          <div className="method-top reveal-group">
            <p className="eyebrow">04 / conduite d’ouvrage</p>
            <h2 id="method-title">Le projet avance<br /><em>quand tout s’aligne.</em></h2>
          </div>
          <ol className="method-steps reveal-group">
            {processSteps.map(([number, label]) => (
              <li key={number}>
                <span>{number}</span>
                <strong>{label}</strong>
                <ArrowDownRight size={20} aria-hidden="true" />
              </li>
            ))}
          </ol>
          <div className="method-proof" aria-label="Repère visuel de chantier">
            <img src={ASSETS.workersPoster} alt="Chantier avec ouvriers et engins en activité" loading="lazy" decoding="async" />
            <span><i className="orange-dot" /> Trace / chantier vivant</span>
          </div>
          <div className="method-progress" aria-hidden="true"><i className="method-progress-fill" /></div>
        </section>

        <section className="contact-section plan-section" data-plan="POINT / 05 — OPEN" id="contact" aria-labelledby="contact-title">
          <div className="structural-sign" aria-hidden="true"><img src={ASSETS.mark} alt="" /><i /></div>
          <div className="contact-background" aria-hidden="true">
            <img src={ASSETS.mark} alt="" />
          </div>
          <div className="contact-content reveal-group">
            <p className="eyebrow"><span className="orange-dot" /> 05 / le prochain ouvrage</p>
            <h2 id="contact-title">Tout commence<br />par un <em>terrain.</em></h2>
            <p className="contact-copy">Parlons de l’usage, du lieu et de l’ambition. Nous construirons la suite avec vous.</p>
            <a className="contact-link" href="mailto:contact@votre-domaine.fr?subject=Projet%20B.T.P.">
              Décrire votre projet <ArrowUpRight aria-hidden="true" size={21} />
            </a>
            <p className="contact-note">Adresse e-mail à personnaliser avant publication</p>
          </div>
          <div className="contact-coordinate">B.T.P. / FRANCE / 2026</div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand-lockup footer-brand" href="#top">
          <span className="brand-sign"><img src={ASSETS.mark} alt="" className="brand-mark" /></span>
          <span className="brand-type">B.T.P.</span>
          <span className="brand-rule" aria-hidden="true" />
        </a>
        <p>Concevoir l’ouvrage. Tenir la promesse.</p>
        <a href="#top" className="back-top">Haut de page <ArrowUpRight size={16} aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
