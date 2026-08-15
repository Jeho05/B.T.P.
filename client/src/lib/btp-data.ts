/**
 * Design system reminder — Matière & Maîtrise:
 * structured, minimal data contracts for real chantier information — no invented social proof.
 */
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseDb } from "./firebase";

export type PublicationStatus = "draft" | "published";

export interface ProjectRecord {
  id: string;
  title: string;
  location: string;
  discipline: string;
  summary: string;
  imageUrl?: string;
  year?: string;
  status: PublicationStatus;
  createdAt?: Timestamp;
}

export interface ServiceRecord {
  id: string;
  title: string;
  summary: string;
  order: number;
  status: PublicationStatus;
}

export interface QuoteRequestInput {
  fullName: string;
  email: string;
  phone?: string;
  projectType: string;
  location?: string;
  message: string;
  consent: boolean;
}

export interface QuoteRequestRecord extends QuoteRequestInput {
  id: string;
  status: "new" | "in_review" | "closed";
  createdAt?: Timestamp;
}

function requireDb() {
  if (!firebaseDb) throw new Error("Firebase n’est pas encore configuré.");
  return firebaseDb;
}

function projectFromSnapshot(id: string, value: Record<string, unknown>): ProjectRecord {
  return {
    id,
    title: String(value.title ?? ""),
    location: String(value.location ?? ""),
    discipline: String(value.discipline ?? ""),
    summary: String(value.summary ?? ""),
    imageUrl: typeof value.imageUrl === "string" ? value.imageUrl : undefined,
    year: typeof value.year === "string" ? value.year : undefined,
    status: value.status === "published" ? "published" : "draft",
    createdAt: value.createdAt instanceof Timestamp ? value.createdAt : undefined,
  };
}

export async function submitQuoteRequest(input: QuoteRequestInput) {
  const db = requireDb();
  return addDoc(collection(db, "quoteRequests"), {
    ...input,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export function subscribePublishedProjects(callback: (projects: ProjectRecord[]) => void) {
  const db = requireDb();
  const projectQuery = query(
    collection(db, "projects"),
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
    limit(24),
  );
  return onSnapshot(projectQuery, (snapshot) => {
    callback(snapshot.docs.map((snapshotDoc) => projectFromSnapshot(snapshotDoc.id, snapshotDoc.data())));
  });
}

export function subscribePublishedServices(callback: (services: ServiceRecord[]) => void) {
  const db = requireDb();
  const serviceQuery = query(
    collection(db, "services"), where("status", "==", "published"), orderBy("order", "asc"), limit(24));
  return onSnapshot(serviceQuery, (snapshot) => {
    callback(snapshot.docs.map((snapshotDoc) => ({
      id: snapshotDoc.id,
      title: String(snapshotDoc.data().title ?? ""),
      summary: String(snapshotDoc.data().summary ?? ""),
      order: Number(snapshotDoc.data().order ?? 0),
      status: "published",
    })));
  });
}

export function subscribeQuoteRequests(callback: (requests: QuoteRequestRecord[]) => void) {
  const db = requireDb();
  const requestsQuery = query(collection(db, "quoteRequests"), orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(requestsQuery, (snapshot) => {
    callback(snapshot.docs.map((snapshotDoc) => ({
      id: snapshotDoc.id,
      fullName: String(snapshotDoc.data().fullName ?? ""),
      email: String(snapshotDoc.data().email ?? ""),
      phone: typeof snapshotDoc.data().phone === "string" ? snapshotDoc.data().phone : undefined,
      projectType: String(snapshotDoc.data().projectType ?? ""),
      location: typeof snapshotDoc.data().location === "string" ? snapshotDoc.data().location : undefined,
      message: String(snapshotDoc.data().message ?? ""),
      consent: Boolean(snapshotDoc.data().consent),
      status: snapshotDoc.data().status === "in_review" || snapshotDoc.data().status === "closed" ? snapshotDoc.data().status : "new",
      createdAt: snapshotDoc.data().createdAt instanceof Timestamp ? snapshotDoc.data().createdAt : undefined,
    })));
  });
}

export async function createProject(project: Omit<ProjectRecord, "id" | "createdAt">) {
  const db = requireDb();
  return addDoc(collection(db, "projects"), { ...project, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function createService(service: Omit<ServiceRecord, "id">) {
  const db = requireDb();
  return addDoc(collection(db, "services"), { ...service, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function setQuoteStatus(id: string, status: QuoteRequestRecord["status"]) {
  const db = requireDb();
  return updateDoc(doc(db, "quoteRequests", id), { status, updatedAt: serverTimestamp() });
}
