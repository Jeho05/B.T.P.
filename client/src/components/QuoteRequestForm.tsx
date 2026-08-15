/**
 * Design system reminder — Matière & Maîtrise:
 * a disciplined, direct request form: evidence first, no decorative noise.
 */
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { firebaseConfigured, firebaseSetupMessage } from "@/lib/firebase";
import { submitQuoteRequest, type QuoteRequestInput } from "@/lib/btp-data";

const initialRequest: QuoteRequestInput = {
  fullName: "",
  email: "",
  phone: "",
  projectType: "",
  location: "",
  message: "",
  consent: false,
};

interface QuoteRequestFormProps {
  compact?: boolean;
}

export function QuoteRequestForm({ compact = false }: QuoteRequestFormProps) {
  const [request, setRequest] = useState<QuoteRequestInput>(initialRequest);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = <Key extends keyof QuoteRequestInput>(key: Key, value: QuoteRequestInput[Key]) => {
    setRequest((current) => ({ ...current, [key]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!request.consent) {
      toast.error("Votre accord est nécessaire avant l’envoi.");
      return;
    }
    if (!firebaseConfigured) {
      toast.error(firebaseSetupMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      await submitQuoteRequest(request);
      setRequest(initialRequest);
      toast.success("Votre demande a été transmise. L’équipe B.T.P. reviendra vers vous.");
    } catch {
      toast.error("La demande n’a pas pu être envoyée. Réessayez dans un instant.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={`request-form ${compact ? "request-form--compact" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="request-form__topline"><span>Point d’entrée / 05</span><span>Réponse humaine</span></div>
      <div className="request-form__grid">
        <label>Nom complet<input value={request.fullName} onChange={(event) => update("fullName", event.target.value)} autoComplete="name" required maxLength={120} /></label>
        <label>E-mail<input value={request.email} onChange={(event) => update("email", event.target.value)} autoComplete="email" type="email" required maxLength={254} /></label>
        <label>Téléphone<input value={request.phone ?? ""} onChange={(event) => update("phone", event.target.value)} autoComplete="tel" maxLength={40} /></label>
        <label>Nature du projet
          <select value={request.projectType} onChange={(event) => update("projectType", event.target.value)} required>
            <option value="" disabled>Choisir une intervention</option>
            <option value="Construction">Construction</option>
            <option value="Réhabilitation">Réhabilitation</option>
            <option value="Aménagement">Aménagement</option>
            <option value="Étude">Étude et conseil</option>
            <option value="Autre">Autre besoin</option>
          </select>
        </label>
        <label className="request-form__full">Lieu du projet<input value={request.location ?? ""} onChange={(event) => update("location", event.target.value)} autoComplete="address-level2" maxLength={160} /></label>
        <label className="request-form__full">Parlez-nous du terrain, de l’usage et de l’ambition<textarea value={request.message} onChange={(event) => update("message", event.target.value)} required maxLength={4000} rows={5} /></label>
      </div>
      <label className="request-form__consent"><input checked={request.consent} onChange={(event) => update("consent", event.target.checked)} type="checkbox" required /> <span>J’accepte que B.T.P. utilise ces informations uniquement pour répondre à cette demande.</span></label>
      <button className="request-form__submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Transmission en cours…" : "Transmettre la demande"}</button>
      {!firebaseConfigured && <p className="request-form__setup">Le canal de transmission est en cours d’ouverture. Vous pouvez aussi revenir très prochainement pour déposer votre demande.</p>}
    </form>
  );
}
