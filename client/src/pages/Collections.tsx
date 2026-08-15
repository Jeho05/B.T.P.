/**
 * Design system reminder — Matière & Maîtrise:
 * public archives use clear editorial cadence, real project data, and mineral restraint.
 */
import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { QuoteRequestForm } from "@/components/QuoteRequestForm";
import { subscribePublishedProjects, subscribePublishedServices, type ProjectRecord, type ServiceRecord } from "@/lib/btp-data";
import { firebaseConfigured } from "@/lib/firebase";

function ArchiveHeader({ index, eyebrow, title, copy }: { index: string; eyebrow: string; title: string; copy: string }) {
  return (
    <header className="archive-hero">
      <Link href="/" className="archive-back">← Retour à B.T.P.</Link>
      <p className="eyebrow"><span className="orange-dot" /> {index} / {eyebrow}</p>
      <h1>{title}</h1>
      <p>{copy}</p>
    </header>
  );
}

function UnconfiguredArchive() {
  return <div className="archive-empty"><span>ARCHIVE EN PRÉPARATION</span><strong>Les premiers ouvrages prennent leurs repères.</strong><p>Les projets validés rejoindront cette archive avec leurs lieux, matières et données de chantier.</p><i className="archive-empty__axis" /></div>;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) return;
    try {
      return subscribePublishedProjects(setProjects);
    } catch {
      setFailed(true);
    }
  }, []);

  return (
    <main className="archive-page">
      <ArchiveHeader index="01" eyebrow="Réalisations" title="Les ouvrages prennent position." copy="Une sélection tenue par les projets effectivement publiés par l’équipe B.T.P." />
      {!firebaseConfigured || failed ? <UnconfiguredArchive /> : projects.length === 0 ? <div className="archive-empty"><span>ARCHIVE EN CONSTRUCTION</span><strong>Aucune réalisation publiée pour le moment.</strong><p>Les réalisations validées dans l’administration apparaîtront automatiquement ici.</p></div> : <section className="project-grid" aria-label="Réalisations publiées">{projects.map((project) => <article className="project-card" key={project.id}>{project.imageUrl && <img src={project.imageUrl} alt="" loading="lazy" />}<div><span>{project.discipline}{project.location ? ` / ${project.location}` : ""}</span><h2>{project.title}</h2><p>{project.summary}</p><footer>{project.year ?? "Projet B.T.P."}<ArrowUpRight aria-hidden="true" size={18} /></footer></div></article>)}</section>}
      <aside className="archive-cta"><p>Un lieu à faire évoluer ?</p><Link href="/devis">Décrire le projet <ArrowDownRight size={18} aria-hidden="true" /></Link></aside>
    </main>
  );
}

export function ServicesPage() {
  const [services, setServices] = useState<ServiceRecord[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!firebaseConfigured) return;
    try {
      return subscribePublishedServices(setServices);
    } catch {
      setFailed(true);
    }
  }, []);

  return (
    <main className="archive-page">
      <ArchiveHeader index="02" eyebrow="Savoir-faire" title="Chaque geste trouve sa juste mesure." copy="Les expertises publiées par B.T.P. sont présentées ici, sans catalogue artificiel." />
      {!firebaseConfigured || failed ? <UnconfiguredArchive /> : services.length === 0 ? <div className="archive-empty"><span>PROGRAMME À VENIR</span><strong>Aucun service n’est encore publié.</strong><p>La liste sera alimentée depuis l’espace d’administration.</p></div> : <ol className="service-list">{services.map((service, index) => <li key={service.id}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{service.title}</h2><p>{service.summary}</p></div><ArrowUpRight aria-hidden="true" /></li>)}</ol>}
      <aside className="archive-cta"><p>Vous avez une question de méthode ?</p><Link href="/devis">Ouvrir la discussion <ArrowDownRight size={18} aria-hidden="true" /></Link></aside>
    </main>
  );
}

export function QuotePage() {
  return <main className="archive-page quote-page"><ArchiveHeader index="05" eyebrow="Parler projet" title="Le prochain ouvrage commence par un échange." copy="Décrivez le lieu, l’usage et les contraintes. Votre demande rejoint directement l’équipe B.T.P." /><QuoteRequestForm /></main>;
}
