/**
 * Design system reminder — Matière & Maîtrise:
 * an operational control room with strict hierarchy, traceable actions and no ornamental dashboard excess.
 */
import { type FormEvent, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Link } from "wouter";
import { toast } from "sonner";
import { createProject, createService, setQuoteStatus, subscribeQuoteRequests, type QuoteRequestRecord } from "@/lib/btp-data";
import { firebaseAuth, firebaseConfigured, firebaseDb, firebaseSetupMessage, firebaseStorage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const initialProject: { title: string; location: string; discipline: string; summary: string; imageUrl: string; year: string; status: "draft" | "published" } = { title: "", location: "", discipline: "", summary: "", imageUrl: "", year: "", status: "draft" };
const initialService: { title: string; summary: string; order: string; status: "draft" | "published" } = { title: "", summary: "", order: "10", status: "draft" };

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [requests, setRequests] = useState<QuoteRequestRecord[]>([]);
  const [project, setProject] = useState(initialProject);
  const [service, setService] = useState(initialService);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, setUser);
  }, []);

  useEffect(() => {
    if (!user || !firebaseDb) {
      setIsAdmin(false);
      return;
    }
    return onSnapshot(doc(firebaseDb, "admins", user.uid), (snapshot) => setIsAdmin(snapshot.exists()), () => setIsAdmin(false));
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    return subscribeQuoteRequests(setRequests);
  }, [isAdmin]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firebaseAuth) return;
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      setPassword("");
      toast.success("Connexion établie.");
    } catch {
      toast.error("Connexion impossible. Vérifiez l’adresse et le mot de passe.");
    }
  }

  async function uploadMedia(file?: File) {
    if (!file || !firebaseStorage) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Choisissez une image ou une vidéo.");
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      toast.error("Le média dépasse la limite de 25 Mo.");
      return;
    }
    try {
      setUploading(true);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const storageRef = ref(firebaseStorage, `projects/${Date.now()}-${safeName}`);
      await uploadBytes(storageRef, file, { contentType: file.type });
      const imageUrl = await getDownloadURL(storageRef);
      setProject((current) => ({ ...current, imageUrl }));
      toast.success("Média importé. Il sera associé à la réalisation lors de l’enregistrement.");
    } catch {
      toast.error("Import impossible. Vérifiez le rôle administrateur et les règles Storage.");
    } finally {
      setUploading(false);
    }
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createProject(project);
      setProject(initialProject);
      toast.success("Réalisation enregistrée.");
    } catch {
      toast.error("Enregistrement impossible. Vérifiez vos droits administrateur.");
    }
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await createService({ ...service, order: Number(service.order) || 0 });
      setService(initialService);
      toast.success("Service enregistré.");
    } catch {
      toast.error("Enregistrement impossible. Vérifiez vos droits administrateur.");
    }
  }

  if (!firebaseConfigured) return <main className="admin-gate"><Link href="/">← B.T.P.</Link><span>ESPACE EN PRÉPARATION</span><h1>La régie prend ses repères.</h1><p>{firebaseSetupMessage}</p></main>;

  if (!user) return <main className="admin-gate"><Link href="/">← B.T.P.</Link><span>ESPACE RÉSERVÉ</span><h1>Conduire les contenus.</h1><p>Connectez-vous avec le compte administrateur créé dans Firebase Authentication.</p><form onSubmit={login} className="admin-login"><label>E-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Mot de passe<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label><button type="submit">Entrer dans l’administration</button></form></main>;

  if (!isAdmin) return <main className="admin-gate"><Link href="/">← B.T.P.</Link><span>ACCÈS À VALIDER</span><h1>Votre niveau d’intervention reste à confirmer.</h1><p>Ce compte est reconnu, mais n’a pas encore reçu le droit de publier ni de consulter les demandes. L’administrateur principal peut finaliser cette validation depuis l’infrastructure sécurisée.</p><button type="button" onClick={() => firebaseAuth && void signOut(firebaseAuth)}>Se déconnecter</button></main>;

  return <main className="admin-page"><header className="admin-header"><div><Link href="/">← B.T.P.</Link><span>ADMINISTRATION / OPÉRATIONNEL</span><h1>Tenir le chantier éditorial.</h1></div><button type="button" onClick={() => firebaseAuth && void signOut(firebaseAuth)}>Déconnexion</button></header><section className="admin-layout"><div className="admin-panel admin-panel--requests"><p className="eyebrow"><i className="orange-dot" /> Demandes de devis</p><h2>{requests.length} à traiter</h2><div className="request-list">{requests.length === 0 ? <p className="admin-empty">Aucune demande reçue.</p> : requests.map((request) => <article key={request.id}><div><strong>{request.fullName}</strong><a href={`mailto:${request.email}`}>{request.email}</a><p>{request.projectType}{request.location ? ` · ${request.location}` : ""}</p><p>{request.message}</p></div><select aria-label={`Statut de ${request.fullName}`} value={request.status} onChange={(event) => void setQuoteStatus(request.id, event.target.value as QuoteRequestRecord["status"])}><option value="new">Nouveau</option><option value="in_review">En cours</option><option value="closed">Clos</option></select></article>)}</div></div><form className="admin-panel admin-form" onSubmit={saveProject}><p className="eyebrow"><i className="orange-dot" /> Publication</p><h2>Nouvelle réalisation</h2><label>Titre<input value={project.title} onChange={(event) => setProject({ ...project, title: event.target.value })} required maxLength={140} /></label><div className="admin-form__pair"><label>Discipline<input value={project.discipline} onChange={(event) => setProject({ ...project, discipline: event.target.value })} required maxLength={100} /></label><label>Lieu<input value={project.location} onChange={(event) => setProject({ ...project, location: event.target.value })} required maxLength={160} /></label></div><label>Année<input value={project.year} onChange={(event) => setProject({ ...project, year: event.target.value })} maxLength={8} /></label><label>Résumé<textarea value={project.summary} onChange={(event) => setProject({ ...project, summary: event.target.value })} required maxLength={1000} rows={4} /></label><label>Média de couverture<input type="file" accept="image/*,video/*" onChange={(event) => void uploadMedia(event.target.files?.[0])} /></label>{project.imageUrl && <p className="admin-uploaded">Média associé et prêt à publier.</p>}<label>État<select value={project.status} onChange={(event) => setProject({ ...project, status: event.target.value as "draft" | "published" })}><option value="draft">Brouillon</option><option value="published">Publié</option></select></label><button type="submit" disabled={uploading}>{uploading ? "Import en cours…" : "Enregistrer la réalisation"}</button></form><form className="admin-panel admin-form" onSubmit={saveService}><p className="eyebrow"><i className="orange-dot" /> Référentiel</p><h2>Nouveau service</h2><label>Intitulé<input value={service.title} onChange={(event) => setService({ ...service, title: event.target.value })} required maxLength={100} /></label><label>Description<textarea value={service.summary} onChange={(event) => setService({ ...service, summary: event.target.value })} required maxLength={1000} rows={4} /></label><label>Ordre d’affichage<input type="number" min="0" value={service.order} onChange={(event) => setService({ ...service, order: event.target.value })} /></label><label>État<select value={service.status} onChange={(event) => setService({ ...service, status: event.target.value as "draft" | "published" })}><option value="draft">Brouillon</option><option value="published">Publié</option></select></label><button type="submit">Enregistrer le service</button></form></section></main>;
}
