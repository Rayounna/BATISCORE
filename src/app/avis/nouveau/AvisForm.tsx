"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, Info, FileCheck } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { METIERS_BTP } from "@/types";
import { cn } from "@/lib/utils";

interface AvisFormProps {
  siretInitial?: string;
}

type EtapeForm = "entreprise" | "chantier" | "notes" | "commentaire" | "confirmation";

interface FormData {
  siret: string;
  prenom: string;
  email: string;
  chantier_type: string;
  chantier_ville: string;
  chantier_annee: number;
  montant_estime: string;
  note_delais: number;
  note_devis_respecte: number;
  note_qualite_finitions: number;
  note_qualite_conformite: number;
  note_communication: number;
  note_proprete: number;
  note_ponctualite: number;
  commentaire: string;
  avec_preuve: boolean;
}

const ANNEES = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i);

const NOTES_FIABILITE = [
  { key: "note_delais" as const, label: "Délais respectés", desc: "Travaux terminés dans les temps prévus" },
  { key: "note_devis_respecte" as const, label: "Devis respecté", desc: "Prix final conforme au devis initial" },
];
const NOTES_QUALITE = [
  { key: "note_qualite_finitions" as const, label: "Qualité des finitions", desc: "Soin apporté aux détails et finitions" },
  { key: "note_qualite_conformite" as const, label: "Conformité", desc: "Travaux conformes à vos attentes" },
];
const NOTES_PRO = [
  { key: "note_communication" as const, label: "Communication", desc: "Disponibilité et clarté des échanges" },
  { key: "note_proprete" as const, label: "Propreté du chantier", desc: "Nettoyage et rangement après intervention" },
  { key: "note_ponctualite" as const, label: "Ponctualité", desc: "Respect des rendez-vous" },
];

const ETAPES: { id: EtapeForm; label: string }[] = [
  { id: "entreprise", label: "Artisan" },
  { id: "chantier", label: "Chantier" },
  { id: "notes", label: "Notes" },
  { id: "commentaire", label: "Commentaire" },
];

export function AvisForm({ siretInitial = "" }: AvisFormProps) {
  const router = useRouter();
  const [etape, setEtape] = useState<EtapeForm>("entreprise");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    siret: siretInitial,
    prenom: "",
    email: "",
    chantier_type: "",
    chantier_ville: "",
    chantier_annee: new Date().getFullYear() - 1,
    montant_estime: "",
    note_delais: 0,
    note_devis_respecte: 0,
    note_qualite_finitions: 0,
    note_qualite_conformite: 0,
    note_communication: 0,
    note_proprete: 0,
    note_ponctualite: 0,
    commentaire: "",
    avec_preuve: false,
  });

  const set = (field: keyof FormData, value: FormData[keyof FormData]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const etapeIndex = ETAPES.findIndex((e) => e.id === etape);

  const handleSubmit = async () => {
    setLoading(true);
    // TODO: appel API Next.js → Supabase
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setEtape("confirmation");
  };

  if (etape === "confirmation") {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-batiscore-navy mb-3">
          Merci pour votre avis !
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Votre avis est en cours de vérification. Il sera publié dans les 24h
          si toutes les conditions sont respectées.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.push("/")}
            className="btn-secondary"
          >
            Retour à l&apos;accueil
          </button>
          {form.siret && (
            <button
              onClick={() => router.push(`/entreprise/${form.siret}`)}
              className="btn-primary"
            >
              Voir la fiche entreprise
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Barre de progression */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {ETAPES.map((e, i) => (
            <div key={e.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    i < etapeIndex
                      ? "bg-green-500 text-white"
                      : i === etapeIndex
                      ? "bg-batiscore-orange text-white"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {i < etapeIndex ? "✓" : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1 font-medium",
                    i === etapeIndex ? "text-batiscore-orange" : "text-gray-400"
                  )}
                >
                  {e.label}
                </span>
              </div>
              {i < ETAPES.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mb-4 transition-colors",
                    i < etapeIndex ? "bg-green-400" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* ─── Étape 1 : Entreprise ───────────────────────────────────── */}
        {etape === "entreprise" && (
          <>
            <div>
              <label className="label">
                SIRET de l&apos;entreprise <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.siret}
                onChange={(e) => set("siret", e.target.value.replace(/\s/g, "").slice(0, 14))}
                placeholder="ex : 12345678901234"
                className="input-field font-mono"
                maxLength={14}
              />
              <p className="text-xs text-gray-400 mt-1.5 flex items-start gap-1">
                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                Trouvez le SIRET sur la facture de l&apos;artisan ou sur societe.com
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Votre prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.prenom}
                  onChange={(e) => set("prenom", e.target.value)}
                  placeholder="Sophie"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">
                  Votre email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="vous@exemple.fr"
                  className="input-field"
                />
                <p className="text-xs text-gray-400 mt-1">Non publié — sert à éviter les doublons</p>
              </div>
            </div>
          </>
        )}

        {/* ─── Étape 2 : Chantier ─────────────────────────────────────── */}
        {etape === "chantier" && (
          <>
            <div>
              <label className="label">
                Type de travaux <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.chantier_type}
                onChange={(e) => set("chantier_type", e.target.value)}
                placeholder="ex : Rénovation salle de bain, Installation chaudière..."
                className="input-field"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Ville du chantier <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.chantier_ville}
                  onChange={(e) => set("chantier_ville", e.target.value)}
                  placeholder="Lyon"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">
                  Année des travaux <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.chantier_annee}
                  onChange={(e) => set("chantier_annee", parseInt(e.target.value))}
                  className="input-field"
                >
                  {ANNEES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label">
                Montant estimé des travaux <span className="text-red-500">*</span>
              </label>
              <select
                value={form.montant_estime}
                onChange={(e) => set("montant_estime", e.target.value)}
                className="input-field"
              >
                <option value="">Sélectionner...</option>
                <option value="moins_1000">Moins de 1 000 €</option>
                <option value="1000_5000">1 000 – 5 000 €</option>
                <option value="5000_15000">5 000 – 15 000 €</option>
                <option value="15000_50000">15 000 – 50 000 €</option>
                <option value="plus_50000">Plus de 50 000 €</option>
              </select>
            </div>
          </>
        )}

        {/* ─── Étape 3 : Notes ────────────────────────────────────────── */}
        {etape === "notes" && (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-batiscore-navy mb-1">
                Fiabilité <span className="text-sm font-normal text-gray-400">(40% du score)</span>
              </h3>
              <div className="space-y-4">
                {NOTES_FIABILITE.map((n) => (
                  <div key={n.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <StarRating
                      value={form[n.key] as number}
                      onChange={(v) => set(n.key, v)}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-batiscore-navy mb-1">
                Qualité <span className="text-sm font-normal text-gray-400">(40% du score)</span>
              </h3>
              <div className="space-y-4">
                {NOTES_QUALITE.map((n) => (
                  <div key={n.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <StarRating
                      value={form[n.key] as number}
                      onChange={(v) => set(n.key, v)}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-batiscore-navy mb-1">
                Professionnalisme <span className="text-sm font-normal text-gray-400">(20% du score)</span>
              </h3>
              <div className="space-y-4">
                {NOTES_PRO.map((n) => (
                  <div key={n.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{n.label}</p>
                      <p className="text-xs text-gray-400">{n.desc}</p>
                    </div>
                    <StarRating
                      value={form[n.key] as number}
                      onChange={(v) => set(n.key, v)}
                      size="md"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Étape 4 : Commentaire + preuve ────────────────────────── */}
        {etape === "commentaire" && (
          <>
            <div>
              <label className="label">
                Votre commentaire <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.commentaire}
                onChange={(e) => set("commentaire", e.target.value)}
                rows={5}
                placeholder="Décrivez votre expérience : qualité du travail, respect des délais, communication... (50 caractères minimum)"
                className="input-field resize-none"
                minLength={50}
                maxLength={2000}
              />
              <div className="flex justify-between mt-1.5 text-xs text-gray-400">
                <span>{form.commentaire.length < 50 ? `Encore ${50 - form.commentaire.length} caractères min.` : "✓ Longueur suffisante"}</span>
                <span>{form.commentaire.length}/2000</span>
              </div>
            </div>

            {/* Preuve */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 rounded-lg p-2 shrink-0">
                  <FileCheck className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    Joindre une preuve{" "}
                    <span className="font-normal text-gray-400">(facultatif)</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Une facture ou photo renforce la crédibilité de votre avis (poids x1,5 dans le score).
                  </p>
                  <label className="mt-3 flex items-center gap-2 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      checked={form.avec_preuve}
                      onChange={(e) => set("avec_preuve", e.target.checked)}
                      className="w-4 h-4 accent-batiscore-orange"
                    />
                    <span className="text-sm text-gray-700">J&apos;ai une preuve à joindre</span>
                  </label>
                  {form.avec_preuve && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                      <Upload className="w-4 h-4" />
                      <span>Upload disponible après soumission (via lien email)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 shrink-0" />
              <p>
                Votre avis sera vérifié par notre équipe avant publication. Tout faux avis entraîne
                une suppression définitive du compte.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6 flex justify-between gap-3">
        {etapeIndex > 0 ? (
          <button
            onClick={() => setEtape(ETAPES[etapeIndex - 1].id)}
            className="btn-secondary"
          >
            ← Retour
          </button>
        ) : (
          <div />
        )}
        {etapeIndex < ETAPES.length - 1 ? (
          <button
            onClick={() => setEtape(ETAPES[etapeIndex + 1].id)}
            className="btn-primary"
          >
            Continuer →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading || form.commentaire.length < 50}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Envoi...
              </>
            ) : (
              "Soumettre mon avis"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
